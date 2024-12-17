"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react'

interface Props {
  children: ReactNode;
  session?: any;
}

export default function NextAuthProvider({ 
  children,
  session = undefined
}: Props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
// thuan