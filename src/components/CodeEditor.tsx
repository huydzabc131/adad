import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { SupportedLanguage } from '../types';
import { Code2, Copy, Check, RotateCcw, ZoomIn, ZoomOut, Settings2 } from 'lucide-react';

interface Props {
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetCode?: () => void;
  isDarkMode?: boolean;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<Props> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetCode,
  isDarkMode = true,
  readOnly = false,
  height = '100%',
}) => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>(isDarkMode ? 'vs-dark' : 'light');

  // Map our language key to monaco language id
  const getMonacoLanguage = (lang: SupportedLanguage): string => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
      case 'java':
        return 'java';
      default:
        return 'plaintext';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E1E] border border-[#30363D] rounded-lg overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="h-10 border-b border-[#30363D] bg-[#252526] flex items-center justify-between px-3 text-xs">
        {/* Language selector tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-400 font-mono font-medium">
            <Code2 className="w-3.5 h-3.5" />
            <select
              value={language}
              disabled={readOnly}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-[#1E1E1E] text-xs font-mono text-blue-400 border border-[#30363D] rounded px-2 py-1 outline-none cursor-pointer"
            >
              <option value="python">Python 3.10</option>
              <option value="cpp">C++ 17 (GCC)</option>
              <option value="c">C (GCC 11)</option>
              <option value="java">Java 17 (OpenJDK)</option>
            </select>
          </div>

          <span className="text-[#8B949E] font-mono text-xs hidden sm:inline">
            {language === 'python' ? 'main.py' : language === 'cpp' ? 'solution.cpp' : language === 'c' ? 'solution.c' : 'Main.java'}
          </span>
        </div>

        {/* Editor Controls */}
        <div className="flex items-center gap-2 text-[#8B949E]">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#1E1E1E] border border-[#30363D] rounded px-1 py-0.5">
            <button
              type="button"
              title="Giảm cỡ chữ"
              onClick={() => setFontSize((f) => Math.max(11, f - 1))}
              className="p-1 hover:text-[#E6EDF3] rounded"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-[#8B949E]">{fontSize}px</span>
            <button
              type="button"
              title="Tăng cỡ chữ"
              onClick={() => setFontSize((f) => Math.min(22, f + 1))}
              className="p-1 hover:text-[#E6EDF3] rounded"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Sao chép mã nguồn"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-[#454545] rounded text-xs font-medium text-[#E6EDF3] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Chép'}</span>
          </button>

          {/* Reset Starter Code */}
          {onResetCode && !readOnly && (
            <button
              type="button"
              onClick={onResetCode}
              title="Khôi phục code mẫu ban đầu"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-[#454545] rounded text-xs font-medium text-[#E6EDF3] hover:text-amber-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[300px] w-full relative bg-[#1E1E1E]">
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={code}
          theme="vs-dark"
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            readOnly: readOnly,
            lineNumbers: 'on',
            folding: true,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            renderLineHighlight: 'all',
          }}
          loading={
            <div className="flex items-center justify-center h-full text-[#8B949E] font-mono text-xs gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Khởi tạo Monaco IDE...</span>
            </div>
          }
        />
      </div>
    </div>
  );
};
