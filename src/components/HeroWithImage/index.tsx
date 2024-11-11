'use client';

import { Container, Title, Text } from '@mantine/core';
import classes from './hero.module.css';

export function HeroWithImage() {
  return (
    <>
      <div className={classes.hero}>
        {/* <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={0}
        /> */}
      </div>
      <Container className={classes.container} size="md">
        <Title className={classes.title}>
          Unlock Your Potential with Our Services
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          Bringing creativity, technology, and strategy together for your
          growth.
        </Text>
      </Container>
    </>
  );
}
