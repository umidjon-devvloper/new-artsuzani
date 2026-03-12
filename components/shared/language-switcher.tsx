"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTransition } from "react";

const languages = [
  { code: "en", name: "EN" },
  { code: "ru", name: "RU" },
  { code: "uz", name: "UZ" },
  { code: "tr", name: "TR" },
  { code: "fr", name: "FR" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      // @ts-expect-error Types for params might be loose
      router.replace({ pathname, params }, { locale: nextLocale });
    });
  };

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-colors gap-2 rounded-full px-4 h-10 font-medium"
          disabled={isPending}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#FFFDF8] border-[#E8DCC4]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`cursor-pointer hover:bg-[#F5ECD5] hover:text-[#8C6239] ${
              locale === lang.code ? "bg-[#F5ECD5] font-semibold text-[#8C6239]" : "text-gray-700"
            }`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
