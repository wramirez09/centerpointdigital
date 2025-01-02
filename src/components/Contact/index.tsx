'use client';
import { motion } from 'framer-motion';
import NewsLatterBox from './NewsLetterBox';
import { Container, Box, Text, Stack } from '@mantine/core';
import { IconAt, IconMapPin, IconPhone, IconSun } from '@tabler/icons-react';
import emailjs from '@emailjs/browser';
import { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

function printHref(title: string, description: string): string {
  const prefixMap: Record<string, string> = {
    Phone: 'tel:',
    Email: 'mailto:',
  };

  return (prefixMap[title] || '') + description;
}

interface ContactIconProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: typeof IconSun;
  title: string;
  description: string;
}

function ContactIcon({
  icon: Icon,
  title,
  description,
  ...others
}: ContactIconProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: '#FFF',
        marginBottom: '1rem',
      }}
    >
      <Box mr="md">
        <Icon size={24} />
      </Box>

      <div>
        <Text size="xs">{title}</Text>
        <a href={printHref(title, description)}>{description}</a>
      </div>
    </div>
  );
}

const MOCKDATA = [
  { title: 'Email', description: 'sales@centerpointdigital.cc', icon: IconAt },
  { title: 'Phone', description: '(708) 568-1456', icon: IconPhone },
  { title: 'Address', description: 'Chicago, IL', icon: IconMapPin },
  {
    title: 'Working hours',
    description: '10 a.m. – 11 p.m CST',
    icon: IconSun,
  },
];

export function ContactIconsList() {
  const items = MOCKDATA.map((item, index) => (
    <ContactIcon key={index} {...item} />
  ));
  return <Stack>{items}</Stack>;
}

const defaultContent = {
  header: 'Let’s Start a Conversation!',
  copy: ' We’d love to hear from you! Whether you have questions about our services, need assistance with a project, or wantt discuss how we can help your business grow, our team is her to assist you. Reach out to us through the form below.',
};

type ContactProps = {
  showNewsLetter?: boolean;
  header?: string;
  copy?: string;
};

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const defaultFormValues = {
  name: '',
  email: '',
  message: '',
};

const Contact: React.FC<ContactProps> = ({
  showNewsLetter = true,
  header = defaultContent.header,
  copy = defaultContent.copy,
}) => {
  useEffect(() => {
    emailjs.init({
      publicKey: '1Y7wGEfTmPGt-GE90',
      // Do not allow headless browsers
      blockHeadless: true,
      blockList: {
        // Block the suspended emails
        list: [],
        // The variable contains the email address
        watchVariable: 'userEmail',
      },
      limitRate: {
        // Set the limit rate for the application
        id: 'app',
        // Allow 1 request per 10s
        throttle: 10000,
      },
    });
  }, []);

  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);

  async function sendEmail() {
    console.log(formValues);
    if (formValues.name !== '') {
      setIsLoading(true);
      emailjs
        .send('default_service', 'template_teh6b2b', {
          name: formValues.name,
          email: formValues.email,
          message: formValues.message,
        })
        .then(
          response => {
            setIsLoading(false);
            setFormValues(defaultFormValues);
          },
          error => {
            console.log('FAILED...', error);
          },
        );
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Container size={'xl'}>
        <section
          id="contact"
          className="overflow-hidden py-16 md:py-20 lg:py-28 w-full"
        >
          <div className="container w-full">
            <div className={`-mx-4 md:flex flex-wrap`}>
              <div className="w-full md:px-4 lg:w-7/12 xl:w-8/12">
                <div
                  className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                  data-wow-delay=".15s
              "
                >
                  <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                    {header}
                  </h2>
                  <p className="mb-12 text-base font-medium text-body-color">
                    We’d love to hear from you! Whether you have questions about
                    our services, need assistance with a project, or want to
                    discuss how we can help your business grow, our team is here
                    to assist you. Reach out to us through the form below.
                  </p>
                  {!isLoading ? (
                    <form id="contactForm">
                      <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 md:w-1/2">
                          <div className="mb-8">
                            <label
                              htmlFor="name"
                              className="mb-3 block text-sm font-medium text-dark dark:text-white"
                            >
                              Your Name
                            </label>
                            <input
                              onChange={event =>
                                setFormValues({
                                  ...formValues,
                                  name: event.target.value,
                                })
                              }
                              value={formValues.name}
                              name="name"
                              type="text"
                              placeholder="Enter your name"
                              className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            />
                          </div>
                        </div>
                        <div className="w-full px-4 md:w-1/2">
                          <div className="mb-8">
                            <label
                              htmlFor="email"
                              className="mb-3 block text-sm font-medium text-dark dark:text-white"
                            >
                              Your Email
                            </label>
                            <input
                              onChange={event =>
                                setFormValues({
                                  ...formValues,
                                  email: event.target.value,
                                })
                              }
                              value={formValues.email}
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            />
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <div className="mb-8">
                            <label
                              htmlFor="message"
                              className="mb-3 block text-sm font-medium text-dark dark:text-white"
                            >
                              Your Message
                            </label>
                            <textarea
                              value={formValues.message}
                              onChange={event =>
                                setFormValues({
                                  ...formValues,
                                  message: event.target.value,
                                })
                              }
                              name="message"
                              rows={5}
                              placeholder="Enter your Message"
                              className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            ></textarea>
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <button
                            className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                            formAction={sendEmail}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-center items-center">
                      <RotatingLines strokeColor="white" width="50px" />
                    </div>
                  )}
                </div>
              </div>
              {showNewsLetter ? (
                <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
                  <NewsLatterBox />
                </div>
              ) : (
                <div className="relative z-10 rounded-sm bg-white p-8 shadow-three dark:bg-gray-dark sm:p-11 lg:p-8 xl:p-11">
                  <ContactIconsList />
                </div>
              )}
            </div>
          </div>
        </section>
      </Container>
    </motion.div>
  );
};

export default Contact;
