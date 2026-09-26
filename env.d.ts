/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** Klaviyo public API key (a.k.a. company / site ID). Safe to expose; set it to open the club list. */
    PUBLIC_KLAVIYO_COMPANY_ID?: string;
    /** The Klaviyo list that "Join the club" signs people up to. */
    KLAVIYO_LIST_ID?: string;
  }
}
