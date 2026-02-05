import { connectToDatabase } from '../db/mongoose';
import PlanModel, { IPlan } from '../db/models/plan.model';

import { FilterQuery } from 'mongoose';

export async function createPlan(data: Partial<IPlan>) {
    await connectToDatabase();
    return PlanModel.create(data);
}

export async function getPlans(filter: FilterQuery<IPlan> = {}) {
    await connectToDatabase();
    // By default, only show active plans unless specified otherwise? 
    // For admin we might want all. Let's let the caller decide.
    return PlanModel.find(filter).sort({ createdAt: -1 }).lean();
}

export async function updatePlan(id: string, data: Partial<IPlan>) {
    await connectToDatabase();
    return PlanModel.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deletePlan(id: string) {
    await connectToDatabase();
    // Soft delete
    return PlanModel.findByIdAndUpdate(id, { active: false }, { new: true });
}

export async function getPlanById(id: string) {
    await connectToDatabase();
    return PlanModel.findById(id).lean();
}
