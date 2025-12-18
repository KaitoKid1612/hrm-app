'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { companiesService } from '@/services';
import type { Company, CompanyType, CompanySize } from '@/types';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
}

interface CompanyFormData {
  name: string;
  type?: CompanyType;
  size?: CompanySize;
  description?: string;
  website?: string;
  industry?: string;
  foundedYear?: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export function CompanyDialog({ open, onOpenChange, company }: CompanyDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!company;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompanyFormData>({
    defaultValues: {
      name: '',
      type: 'COMPANY',
      size: '11-50',
      description: '',
      website: '',
      industry: '',
      location: '',
      address: '',
      city: '',
      country: 'Vietnam',
      phone: '',
      email: '',
      linkedIn: '',
      facebook: '',
      twitter: '',
      isVerified: false,
      isFeatured: false,
      isActive: true,
    },
  });

  const type = watch('type');
  const size = watch('size');
  const isVerified = watch('isVerified');
  const isFeatured = watch('isFeatured');
  const isActive = watch('isActive');

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        type: company.type,
        size: company.size,
        description: company.description || '',
        website: company.website || '',
        industry: company.industry || '',
        location: company.location || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || 'Vietnam',
        phone: company.phone || '',
        email: company.email || '',
        linkedIn: company.linkedIn || '',
        facebook: company.facebook || '',
        twitter: company.twitter || '',
        isVerified: company.isVerified,
        isFeatured: company.isFeatured,
        isActive: company.isActive,
      });
    } else {
      reset();
    }
  }, [company, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      if (isEditing) {
        return companiesService.updateCompany(company.id, data);
      }
      throw new Error('Create company not available from admin panel');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies-stats'] });
      toast.success(isEditing ? 'Company updated successfully' : 'Company created successfully');
      onOpenChange(false);
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to save company');
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Company' : 'Create New Company'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update company information' : 'Add a new company to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="ABC Company Ltd"
                {...register('name', { required: 'Company name is required' })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Company Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setValue('type', e.target.value as CompanyType)}
              >
                <option value="COMPANY">Company</option>
                <option value="STARTUP">Startup</option>
                <option value="SMALL_BUSINESS">Small Business</option>
                <option value="CORPORATION">Corporation</option>
                <option value="HEADHUNTER">Headhunter</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <select
                id="size"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={size}
                onChange={(e) => setValue('size', e.target.value as CompanySize)}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5000+">5000+ employees</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Company description..."
              rows={4}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" placeholder="Technology" {...register('industry')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                placeholder="2020"
                {...register('foundedYear', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://example.com" {...register('website')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                {...register('email')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+84 123 456 789" {...register('phone')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Ho Chi Minh City" {...register('location')} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Street" {...register('address')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Ho Chi Minh" {...register('city')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Vietnam" {...register('country')} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input
                id="linkedIn"
                placeholder="https://linkedin.com/..."
                {...register('linkedIn')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/..."
                {...register('facebook')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" placeholder="https://twitter.com/..." {...register('twitter')} />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isVerified"
                checked={isVerified}
                onCheckedChange={(v) => setValue('isVerified', v)}
              />
              <Label htmlFor="isVerified">Verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(v) => setValue('isFeatured', v)}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setValue('isActive', v)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
