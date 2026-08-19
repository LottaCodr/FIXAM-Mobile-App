import { DEMO_USER } from "@/data/mock";
import { sleep } from "@/utils/debounce";

export async function fetchProfile() {
    await sleep(150);
    return DEMO_USER;
}
