'use client';

import React from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          href={`/?lang=${language}`} 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-primary/20 bg-background flex items-center justify-center">
            <img
              src="/logo-svetlana.svg"
              alt="Логотип Светланы Дроздовой"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-lg hidden sm:block">
            {t('siteTitle')}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
