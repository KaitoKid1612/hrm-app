// Re-export Prisma enums for convenience
export {
  Role,
  JobType,
  JobLevel,
  ApplicationStatus,
  Gender,
  ExperienceLevel,
} from '@prisma/client';

export enum NotificationType {
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  NEW_JOB = 'NEW_JOB',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
}
