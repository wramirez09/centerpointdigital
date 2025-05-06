import { Icon, IconProps } from "@tabler/icons-react";
import { ForwardRefExoticComponent, ReactElement, RefAttributes } from "react";

export type Project = {
    title: string;
    description: string;
    image: string;
    link: string;
    tags: {tag: string, icon?:ReactElement<any, any>}[];
    stacks: ReactElement[];
    methods: string[];
}