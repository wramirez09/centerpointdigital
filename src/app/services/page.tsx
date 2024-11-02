import Breadcrumb from "@/components/Common/Breadcrumb";
import { Container, Text, Button, Group } from "@mantine/core";
import { GithubIcon } from "@mantinex/dev-icons";
import { Metadata } from "next";
import classes from "./HeroTitle.module.css";

export const metadata: Metadata = {
  title:
    "About Page | Custom Software Development, Design & Digital Marketing Solutions",
  description: "Software | Marketing",
  // other metadata
};

const ServicesPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <div className={classes.wrapper}>
        <Container size={700} className={classes.inner}>
          <h1 className={classes.title}>
            A{" "}
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              inherit
            >
              fully featured
            </Text>{" "}
            React components and hooks library
          </h1>

          <Text className={classes.description} color="dimmed">
            Build fully functional accessible web applications with ease –
            Mantine includes more than 100 customizable components and hooks to
            cover you in any situation
          </Text>

          <Group className={classes.controls}>
            <Button
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Get started
            </Button>

            <Button
              component="a"
              href="https://github.com/mantinedev/mantine"
              size="xl"
              variant="default"
              className={classes.control}
              leftSection={<GithubIcon size={20} />}
            >
              GitHub
            </Button>
          </Group>
        </Container>
      </div>
      );
    </>
  );
};

export default ServicesPage;
