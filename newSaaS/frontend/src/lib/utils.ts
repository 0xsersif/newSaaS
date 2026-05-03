import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/** Format number as MAD currency */
export function formatMAD(amount: number): string {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/** Format date */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat('fr-MA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...opts,
    }).format(new Date(date));
}

/** Format relative time */
export function timeAgo(date: string | Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'à l\'instant';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}j`;
}

/** Build WhatsApp deep link */
export function buildWhatsAppLink(phone: string, message: string): string {
    const clean = phone.replace(/\D/g, '');
    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Build WhatsApp order message */
export function buildWhatsAppOrderMessage({
    productName,
    variant,
    qty,
    price,
}: {
    productName: string;
    variant?: string;
    qty: number;
    price: number;
}): string {
    return `Bonjour, je voudrais commander:\n\n🛍️ *${productName}*${variant ? `\n📦 Variante: ${variant}` : ''}\n🔢 Quantité: ${qty}\n💰 Prix: ${formatMAD(price)}\n\nMerci!`;
}

/** Truncate text */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '…';
}

/** Get initials from name */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
}

/** Slugify string */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/** Get order status config */
export function getOrderStatusConfig(status: string) {
    const configs: Record<string, { label: string; badge: string; dot: string }> = {
        new: { label: 'Nouveau', badge: 'badge-new', dot: 'bg-cyan-400' },
        confirmed: { label: 'Confirmé', badge: 'badge-confirmed', dot: 'bg-indigo-400' },
        shipped: { label: 'Expédié', badge: 'badge-shipped', dot: 'bg-amber-400' },
        delivered: { label: 'Livré', badge: 'badge-delivered', dot: 'bg-emerald-400' },
        cancelled: { label: 'Annulé', badge: 'badge-cancelled', dot: 'bg-rose-400' },
        returned: { label: 'Retourné', badge: 'badge-cancelled', dot: 'bg-rose-400' },
    };
    return configs[status] ?? { label: status, badge: 'badge-inactive', dot: 'bg-gray-400' };
}
