import { CreateTestDto } from "./create.test.dto";

export interface PatchTestDto extends Partial<CreateTestDto> {
    _id: String;
}
