declare module 'slugify' {
  interface SlugifyOptions {
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  }
  
  function slugify(text: string, options?: SlugifyOptions): string;
  export = slugify;
}
