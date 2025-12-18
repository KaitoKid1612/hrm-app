'use client';

import React from 'react';
import { z } from 'zod';
import { Form, FormField, FormSection, FormActions } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { logger } from '@/lib/logger';
import { emailSchema, passwordSchema, requiredString } from '@/lib/validations';

/**
 * Example form component demonstrating best practices
 * This shows how to use:
 * - Form wrapper with Zod validation
 * - Toast notifications
 * - Logger
 * - Form fields and sections
 */

// Define form schema
const exampleSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: requiredString('Name', 2),
  phone: z.string().optional(),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

export function ExampleForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: ExampleFormData) => {
    setIsSubmitting(true);
    logger.info('Form submitted', { data });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      toast.success('Form submitted successfully', {
        description: `Welcome, ${data.name}!`,
      });

      logger.info('Form submission successful', { userId: 'example-id' });
    } catch (error) {
      // Error
      toast.error('Failed to submit form', error as Error);
      logger.error('Form submission failed', error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
        <CardDescription>
          Demonstrating form validation, toast notifications, and logging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          schema={exampleSchema}
          defaultValues={{
            email: '',
            password: '',
            name: '',
            phone: '',
          }}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <>
              <FormSection title="Personal Information" description="Enter your personal details">
                <FormField
                  label="Full Name"
                  error={form.formState.errors.name?.message}
                  required
                  htmlFor="name"
                >
                  <Input id="name" {...form.register('name')} placeholder="John Doe" />
                </FormField>

                <FormField
                  label="Email"
                  error={form.formState.errors.email?.message}
                  required
                  htmlFor="email"
                >
                  <Input
                    id="email"
                    {...form.register('email')}
                    type="email"
                    placeholder="john@example.com"
                  />
                </FormField>

                <FormField
                  label="Phone"
                  error={form.formState.errors.phone?.message}
                  htmlFor="phone"
                >
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    type="tel"
                    placeholder="0123456789"
                  />
                </FormField>
              </FormSection>

              <FormSection title="Security" description="Choose a strong password">
                <FormField
                  label="Password"
                  error={form.formState.errors.password?.message}
                  required
                  htmlFor="password"
                >
                  <Input
                    id="password"
                    {...form.register('password')}
                    type="password"
                    placeholder="••••••••"
                  />
                </FormField>
              </FormSection>

              <FormActions align="right">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    toast.info('Form reset');
                  }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </FormActions>
            </>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}

/**
 * Example component showing toast variations
 */
export function ToastExamples() {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Toast Examples</CardTitle>
        <CardDescription>Click buttons to see different toast types</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Success message')}>Success Toast</Button>

        <Button onClick={() => toast.error('Error message', new Error('Something went wrong'))}>
          Error Toast
        </Button>

        <Button onClick={() => toast.warning('Warning message')}>Warning Toast</Button>

        <Button onClick={() => toast.info('Info message')}>Info Toast</Button>

        <Button
          onClick={() => {
            const loadingId = toast.loading('Loading...');
            setTimeout(() => {
              toast.dismiss(loadingId);
              toast.success('Done!');
            }, 2000);
          }}
        >
          Loading Toast
        </Button>

        <Button
          onClick={() => {
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: 'Processing...',
              success: 'Completed!',
              error: 'Failed!',
            });
          }}
        >
          Promise Toast
        </Button>
      </CardContent>
    </Card>
  );
}
