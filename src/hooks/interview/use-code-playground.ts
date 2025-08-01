import { UserIdContext } from '@/components/providers/user-id-provider';
import {
  LanguageOption,
  languageOptions,
  PYTHON_INDEX,
} from '@/constants/language-options';
import { AuthError, InterviewAPIError } from '@/errors/api-errors';
import { NotFoundError } from '@/errors/not-found';
import { defineTheme } from '@/lib/define-theme';
import { Theme } from '@/types/theme';
import { Optional } from '@/types/util';
import { InterviewAPI } from '@/utils/api/interview-api';
import { errorLog } from '@/utils/logger';
import { Question } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function useCodePlayground(
  question: Question,
  interviewId: string
) {
  const userId = useContext(UserIdContext);
  const { theme: systemTheme } = useTheme();
  const [theme, setTheme] = useState<Theme>(() =>
    getThemeFromSystem(systemTheme ?? 'light')
  );
  const [language, setLanguage] = useState<Optional<LanguageOption>>();
  const [code, setCode] = useState<string>('');

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      if (['light', 'vs-dark'].includes(newTheme)) {
        setTheme(newTheme);
        saveThemeToLocalStorage(newTheme, systemTheme ?? 'light');
      } else {
        defineTheme(newTheme).then(() => setTheme(newTheme));
        saveThemeToLocalStorage(newTheme, systemTheme ?? 'light');
      }
    },
    [systemTheme]
  );

  const handleStarterCodeChange = useCallback(
    (language: string) => {
      setLanguage(
        languageOptions.find((lang) => lang.value === language) ??
          languageOptions[PYTHON_INDEX] // Default to Python if not found
      );
      setCode(
        question.starterCode?.[language as keyof typeof question.starterCode] ||
          ''
      );
    },
    [question]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: LanguageOption) => {
      setLanguage(newLanguage);
      handleStarterCodeChange(newLanguage.value);
    },
    [handleStarterCodeChange]
  );

  // Fetch the initial code and language for the interview if it exists
  useEffect(() => {
    (async () => {
      try {
        const interview = await InterviewAPI.getInterview(
          userId || -1, // fallbacks to -1 if userId is not available
          interviewId
        );

        setCode(interview.code || '');
        setLanguage(
          languageOptions.find(
            (lang) => lang.value === interview.codeLanguage?.toLowerCase()
          ) ?? languageOptions[PYTHON_INDEX]
        );
      } catch (error) {
        if (error instanceof AuthError) {
          alert('Authentication error. Please log in again.');
        } else if (error instanceof NotFoundError) {
          // expected to happen on first load if interview does not exist
        } else if (error instanceof InterviewAPIError) {
          errorLog(`Failed to fetch interview: ${error.message}`);
          alert(`Failed to fetch interview: ${error.message}`);
        } else {
          errorLog(`Unexpected error fetching interview: ${error}`);
        }
        handleLanguageChange(languageOptions[PYTHON_INDEX]); // Default to Python if interview not found or error
      }
    })();
  }, [
    question,
    interviewId,
    userId,
    handleStarterCodeChange,
    handleLanguageChange,
  ]);

  useEffect(() => {
    const newTheme = getThemeFromSystem(systemTheme ?? 'light');
    handleThemeChange(newTheme);
  }, [handleThemeChange, systemTheme]);

  return {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  };
}

const THEME_STORAGE_KEY_LIGHT = 'code-playground-theme-light';
const THEME_STORAGE_KEY_DARK = 'code-playground-theme-dark';

const saveThemeToLocalStorage = (theme: Theme, systemTheme: string) => {
  const isDark =
    systemTheme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : systemTheme === 'dark';

  localStorage.setItem(
    isDark ? THEME_STORAGE_KEY_DARK : THEME_STORAGE_KEY_LIGHT,
    theme
  );
};

const getThemeFromSystem = (systemTheme: string): Theme => {
  const isDark =
    systemTheme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : systemTheme === 'dark';

  const storageKey = isDark ? THEME_STORAGE_KEY_DARK : THEME_STORAGE_KEY_LIGHT;

  const storedTheme =
    typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

  if (storedTheme) {
    return storedTheme as Theme;
  }

  if (systemTheme === 'system') {
    return isDark ? 'night-owl' : 'light';
  } else {
    return systemTheme === 'dark' ? 'night-owl' : 'light';
  }
};
