import { createServerFn } from "@tanstack/react-start";
import {
  handleCreateLead,
  handleUpdateLeadResult,
  type CreateLeadPayload,
  type UpdateLeadResultPayload,
} from "./api-handlers";

export const createLeadFn = createServerFn({ method: "POST" })
  .validator((data: CreateLeadPayload) => data)
  .handler(async ({ data }) => {
    return await handleCreateLead(data);
  });

export const updateLeadResultFn = createServerFn({ method: "POST" })
  .validator((data: UpdateLeadResultPayload) => data)
  .handler(async ({ data }) => {
    return await handleUpdateLeadResult(data);
  });
