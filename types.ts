export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ProposalRequest {
  sectionTopic: string;
  userNotes: string;
}

export interface ProposalResponse {
  id: string;
  request: ProposalRequest;
  response: string;
  sources?: GroundingSource[];
  timestamp: Date;
}
