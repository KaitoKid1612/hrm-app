'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building,
  MapPin,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  Briefcase,
  Star,
  CheckCircle,
  Edit,
} from 'lucide-react';
import { companiesService } from '@/services/companies.service';
import { CompanyDialog } from '@/components/companies/company-dialog';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: company, isLoading } = useQuery({
    queryKey: ['admin-company', companyId],
    queryFn: () => companiesService.getCompanyById(companyId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-75" />
          <Skeleton className="h-4 w-125" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-50" />
          <Skeleton className="h-50" />
          <Skeleton className="h-50" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Company not found</h2>
        <p className="text-sm text-muted-foreground">
          The company you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            {company.isVerified && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {company.isFeatured && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            <Badge variant={company.isActive ? 'default' : 'destructive'}>
              {company.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              {company.type}
            </span>
            {company.size && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {company.size} employees
              </span>
            )}
            {company.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.location}
              </span>
            )}
          </div>
        </div>
        <Button onClick={() => setEditDialogOpen(true)} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Company
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Company Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.industry && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Founded</p>
                      <p className="text-sm text-muted-foreground">{company.foundedYear}</p>
                    </div>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{company.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a
                        href={`tel:${company.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {company.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {company.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Social Links */}
          {(company.linkedIn || company.facebook || company.twitter) && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                {company.linkedIn && (
                  <a
                    href={company.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
                {company.facebook && (
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {company.twitter && (
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Twitter
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Posted Jobs</CardTitle>
              <CardDescription>Jobs posted by this company</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Job listings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Followers</CardTitle>
              <CardDescription>Users following this company</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Follower list will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CompanyDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} company={company} />
    </div>
  );
}
