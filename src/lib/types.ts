type Conversation = {
  id?: string;
  user_id?: string;
  title: string;
  created_at?: Date;
};

type Message = {
  id?: string;
  content: string;
  conversation_id?: string;
  role?: string;
  embedding?: string;
  created_at?: Date;
};

type KnowledgeChunks = {
  id?: string;
  content: string;
  embedding?: string;
  source_file: string;
  chunk_index?: number;
  created_at?: Date;
};

type MatchedEmbedding = {
  content: string;
  source_file: string;
  distance?: number;
};
