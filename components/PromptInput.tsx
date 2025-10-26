"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface PromptInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const t = useTranslations('home');
  const errorT = useTranslations('errors');
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError(t('enterTopic'));
      return;
    }

    if (topic.length > 200) {
      setError(t('topicTooLong'));
      return;
    }

    onSubmit(topic.trim());
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              {t('quizTopic')}
            </label>
            <Input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError("");
              }}
              placeholder={t('topicPlaceholder')}
              maxLength={200}
              disabled={isLoading}
              className="text-lg"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{error && <span className="text-red-600">{error}</span>}</span>
              <span>{topic.length}/200</span>
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!topic.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? t('generatingQuiz') : t('generateButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

