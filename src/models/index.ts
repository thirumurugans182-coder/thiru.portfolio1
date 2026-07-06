import mongoose, { Schema, Document, Model } from 'mongoose';

// About Schema
export interface IAbout extends Document {
  heading: string;
  description: string;
  heroImage?: string;
  heroTitle?: string;
  heroRole?: string;
  heroDescription?: string;
  socialLinks?: { platform: string; url: string; icon: string }[];
}

const AboutSchema = new Schema<IAbout>({
  heading: { type: String, required: false },
  description: { type: String, required: false },
  heroImage: String,
  heroTitle: String,
  heroRole: String,
  heroDescription: String,
  socialLinks: [{ platform: String, url: String, icon: String }]
}, { timestamps: true });

export const About: Model<IAbout> = mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

// Skill Schema
export interface ISkill extends Document {
  title: string;
  icon: string;
  skills: string[];
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  skills: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

// Project Schema
export interface IProject extends Document {
  title: string;
  category: string;
  imageUrl: string;
  order: number;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

// Feedback Schema
export interface IFeedback extends Document {
  name: string;
  role: string;
  message: string;
  rating: number;
  isApproved: boolean;
}

const FeedbackSchema = new Schema<IFeedback>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

// Visit Schema
export interface IVisit extends Document {
  count: number;
}

const VisitSchema = new Schema<IVisit>({
  count: { type: Number, default: 0 },
}, { timestamps: true });

export const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
