export abstract class OAuth2Strategy {
  protected abstract TOKEN_URL: string;

  protected abstract extractUserCredentialsFromIdToken(idToken: string): {
    id: string;
    email?: string;
    name: string;
    familyName: string;
  };

  protected abstract verifyCode(
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; idToken: string }>;

  async getUserCredentials(
    code: string,
    redirectUri: string,
  ): Promise<{
    id: string;
    email?: string;
    name: string;
    familyName: string;
  }> {
    const { idToken } = await this.verifyCode(code, redirectUri);
    return this.extractUserCredentialsFromIdToken(idToken);
  }
}
