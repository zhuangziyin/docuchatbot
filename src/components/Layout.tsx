import styles from './styles/Layout.module.css';
import { ReactNode } from 'react';
import Head from 'next/head'
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: ReactNode;
  narrow: string
}

export default function Layout({ children, narrow }: LayoutProps) {
  return (
    <>
    <Head>
        <title>ChatPDF</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LanguageSwitcher float="right" narrow={narrow} />
      <main className={styles.main}>
        
      <div className={styles.randomBack}>
      </div>   
        {children} 
        </main>
    </>
  );
}
