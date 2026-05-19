export interface RMOrigin {
  name: string;
  url: string;
}

export interface RMLocation {
  name: string;
  url: string;
}

export interface RMCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: RMOrigin;
  location: RMLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RMCharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RMCharacter[];
}