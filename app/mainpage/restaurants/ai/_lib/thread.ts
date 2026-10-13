export type ChatRole = "owner" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

const REPLIES = [
  "Noted. I will keep that with tonight’s service notes.",
  "The main floor still has four free tables. The 19:30 booking is two guests.",
  "One person is waiting to join the team. Review that request on Staff.",
];

export function openThread(restaurantName: string): ChatMessage[] {
  return [
    {
      id: "welcome",
      role: "assistant",
      text: `Good evening. I can check covers, the floor, and join requests for ${restaurantName}.`,
      time: "18:02",
    },
    {
      id: "ask-tonight",
      role: "owner",
      text: "How is tonight looking?",
      time: "18:04",
    },
    {
      id: "tonight",
      role: "assistant",
      text: "Twelve tables are seated. Four are still free on the main floor, and the next booking is two guests at 19:30.",
      time: "18:04",
    },
    {
      id: "ask-staff",
      role: "owner",
      text: "Is anyone waiting to join the team?",
      time: "18:06",
    },
    {
      id: "staff",
      role: "assistant",
      text: "One request is open. They can start on the evening service. Accept or decline it from Staff.",
      time: "18:06",
    },
  ];
}

export function replyFor(sentCount: number): string {
  return REPLIES[sentCount % REPLIES.length] ?? REPLIES[0];
}

export function clockLabel(date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Tunis",
  }).format(date);
}
