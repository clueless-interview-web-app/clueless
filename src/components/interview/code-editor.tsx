'use client';

import Editor from '@monaco-editor/react';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import { FeedbackContext } from '../providers/feedback-provider';

export default function CodeEditor({
  languageValue,
  theme,
  code,
  setCode,
  isDisabled,
}: {
  languageValue: string;
  theme: string;
  code: string;
  setCode: (value: string) => void;
  isDisabled: boolean;
}) {
  const isFeedback = useContext(FeedbackContext);
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while trying to display code editor, try again later" />
      }
    >
      <div className="shadow flex h-full">
        <Editor
          height="100%"
          language={languageValue}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            minimap: { enabled: false },
            readOnly: isDisabled || isFeedback,
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
