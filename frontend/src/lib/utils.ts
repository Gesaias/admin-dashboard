import { clsx, type ClassValue } from "clsx"
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserLogged: () => Promise<User | null> = async () => {
    const session = await getSession();
    if (!session) return null;
    return session.user;
};