interface ReviewWithUser {
    id: number;
    title: string;
    description: string;
    suitable: boolean;
    createdAt: Date;
    userName: string;
    userSurname: string;
    userEmail: string;
    userPhoto: string | null;
    digestiveCondition: string | null;
  }