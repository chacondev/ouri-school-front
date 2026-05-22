import { Injectable } from '@angular/core';

const CRYPTO_SECRET = 'SegredoSecreto10!';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private keyPromise: Promise<CryptoKey>;

  constructor() {
    this.keyPromise = this.gerarChave(CRYPTO_SECRET);
  }

  private async gerarChave(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(secret));
    const keyBytes = new Uint8Array(hashBuffer).slice(0, 16);
    return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
  }

  async criptografar(valor: string): Promise<string> {
    const key = await this.keyPromise;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      key,
      enc.encode(valor)
    );
    const result = new Uint8Array(12 + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), 12);
    return btoa(String.fromCharCode(...result));
  }
}
