import { CreateExaminationDto } from "./create.examination.dto";

export interface PatchExaminationDto extends Partial<CreateExaminationDto> {
    _id: String;
    test_id?: String;
}
