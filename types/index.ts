export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  created_at: string;
}

export interface Film {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: 'video' | 'image';
  thumbnail_url: string;
  created_at: string;
}

export interface AIImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Resume {
  id: string;
  type: 'fullstack' | 'ai_creator';
  file_url: string;
  updated_at: string;
}
