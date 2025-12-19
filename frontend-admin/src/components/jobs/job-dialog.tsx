'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { jobsService, companiesService, categoriesService } from '@/services';
import type { Job, JobType, JobLevel, WorkMode, SalaryType } from '@/types';

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
}

interface JobFormData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  niceToHave?: string;
  companyId?: string;
  categoryId?: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  workMode?: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  showSalary?: boolean;
  type: JobType;
  level: JobLevel;
  positions?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  isHot: boolean;
  isActive: boolean;
  deadline?: string;
}

export function JobDialog({ open, onOpenChange, job }: JobDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!job;

  // Fetch companies for dropdown
  const { data: companiesData } = useQuery({
    queryKey: ['companies-all'],
    queryFn: () => companiesService.getAllCompanies({ limit: 1000 }),
    enabled: open,
  });

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoriesService.getCategories(),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobFormData>({
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      niceToHave: '',
      location: '',
      address: '',
      city: '',
      country: 'Vietnam',
      workMode: 'ONSITE',
      salaryMin: undefined,
      salaryMax: undefined,
      salaryType: 'NEGOTIABLE',
      salaryCurrency: 'VND',
      showSalary: true,
      type: 'FULL_TIME',
      level: 'JUNIOR',
      positions: 1,
      status: 'DRAFT',
      isHot: false,
      isActive: true,
    },
  });

  const type = watch('type');
  const level = watch('level');
  const workMode = watch('workMode');
  const salaryType = watch('salaryType');
  const status = watch('status');
  const isHot = watch('isHot');
  const isActive = watch('isActive');
  const showSalary = watch('showSalary');

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        benefits: job.benefits || '',
        niceToHave: job.niceToHave || '',
        companyId: job.companyId || undefined,
        categoryId: job.categoryId || undefined,
        location: job.location || '',
        address: job.address || '',
        city: job.city || '',
        country: job.country || 'Vietnam',
        workMode: job.workMode || 'ONSITE',
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
        salaryType: job.salaryType || 'NEGOTIABLE',
        salaryCurrency: job.salaryCurrency || 'VND',
        showSalary: job.showSalary ?? true,
        type: job.type,
        level: job.level,
        positions: job.positions || 1,
        status: job.status,
        isHot: job.isHot,
        isActive: job.isActive,
        deadline: job.deadline ? job.deadline.split('T')[0] : undefined,
      });
    } else {
      reset();
    }
  }, [job, reset]);

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const payload = {
        ...data,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
        positions: data.positions ? Number(data.positions) : 1,
      };

      if (isEditing) {
        return jobsService.updateJob(job.id, payload);
      }
      return jobsService.createJob(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-stats'] });
      toast.success(isEditing ? 'Job updated successfully' : 'Job created successfully');
      onOpenChange(false);
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to save job');
    },
  });

  const onSubmit = (data: JobFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update job information' : 'Add a new job posting'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <select
                    id="companyId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('companyId')}
                  >
                    <option value="">Select company...</option>
                    {companiesData?.data?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('categoryId')}
                  >
                    <option value="">Select category...</option>
                    {categoriesData?.map((category: { id: string; name: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job..."
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List job requirements..."
                  rows={3}
                  {...register('requirements')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  placeholder="List job responsibilities..."
                  rows={3}
                  {...register('responsibilities')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  placeholder="List job benefits..."
                  rows={3}
                  {...register('benefits')}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Job Details</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={type}
                    onChange={(e) => setValue('type', e.target.value as JobType)}
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="TEMPORARY">Temporary</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Job Level</Label>
                  <select
                    id="level"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={level}
                    onChange={(e) => setValue('level', e.target.value as JobLevel)}
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MIDDLE">Middle</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DIRECTOR">Director</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <select
                    id="workMode"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={workMode}
                    onChange={(e) => setValue('workMode', e.target.value as WorkMode)}
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positions">Number of Positions</Label>
                  <Input
                    id="positions"
                    type="number"
                    min="1"
                    placeholder="1"
                    {...register('positions')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" type="date" {...register('deadline')} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Location</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Ho Chi Minh City"
                    {...register('location')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g. Ho Chi Minh" {...register('city')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address" {...register('address')} />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Salary Information</h3>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <select
                    id="salaryType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={salaryType}
                    onChange={(e) => setValue('salaryType', e.target.value as SalaryType)}
                  >
                    <option value="NEGOTIABLE">Negotiable</option>
                    <option value="HOURLY">Hourly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Min Salary</Label>
                  <Input id="salaryMin" type="number" placeholder="0" {...register('salaryMin')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary</Label>
                  <Input id="salaryMax" type="number" placeholder="0" {...register('salaryMax')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryCurrency">Currency</Label>
                  <Input id="salaryCurrency" placeholder="VND" {...register('salaryCurrency')} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showSalary"
                  checked={showSalary}
                  onCheckedChange={(checked) => setValue('showSalary', checked)}
                />
                <Label htmlFor="showSalary" className="cursor-pointer">
                  Show salary publicly
                </Label>
              </div>
            </div>

            {/* Status & Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Status & Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setValue('status', e.target.value as JobFormData['status'])}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active (accepting applications)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHot"
                    checked={isHot}
                    onCheckedChange={(checked) => setValue('isHot', checked)}
                  />
                  <Label htmlFor="isHot" className="cursor-pointer">
                    Hot job (featured/urgent)
                  </Label>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
