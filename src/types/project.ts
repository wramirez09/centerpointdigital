import { Icon, IconProps } from "@tabler/icons-react";
import { ReactElement } from "react";

export type Project = {
    title: string;
    description: string;
    image: string;
    link: string;
    tags: string[];
    stacks: ReactElement[];
    methods: string[];
}