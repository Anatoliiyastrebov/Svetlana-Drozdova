'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_OWNER } from '@/lib/site-owner';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="text-center sm:text-left">
            <div>© {new Date().getFullYear()} {language === 'ru' ? 'Анкета по здоровью' : 'Health Questionnaire'}</div>
            <div>{SITE_OWNER.name}</div>
            <div>{SITE_OWNER.phone}</div>
            <a href={`mailto:${SITE_OWNER.email}`} className="hover:text-foreground transition-colors">
              {SITE_OWNER.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/data-request"
              className="hover:text-foreground transition-colors"
            >
              {language === 'ru' ? 'Запрос данных' : 'Data Request'}
            </Link>
            <Link
              href="/impressum"
              className="hover:text-foreground transition-colors"
            >
              {language === 'ru' ? 'О нас и контакты' : 'About & Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
