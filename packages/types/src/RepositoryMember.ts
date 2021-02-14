// Generated from: http://json2ts.com/
interface GroupSamlIdentity {
  extern_uid: string;
  provider: string;
  saml_provider_id: number;
}

export interface RepositoryMember {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  expires_at: Date;
  access_level: RepositoryMember.AccessLevel;
  group_saml_identity?: GroupSamlIdentity;
  email: string;
}

export namespace RepositoryMember {
  export enum AccessLevel {
    NO_ACCESS = 0,
    MINIMAL_ACCESS = 5,
    GUEST = 10,
    REPORTER = 20,
    DEVELOPER = 30,
    MAINTAINER = 40,
    OWNER = 50,
  }
}