import type { ReactNode } from "react";

import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  className: string;
  children: ReactNode;
  iconClassName?: string;
};

/** Opens WhatsApp with the general enquiry preloaded. */
export function WhatsAppButton({ className, children, iconClassName }: Props) {
  return (
    <a
      href={generalWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <WhatsAppIcon className={iconClassName ?? "size-[18px]"} />
      {children}
    </a>
  );
}
