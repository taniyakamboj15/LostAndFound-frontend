import { InfoIcon } from '@assets/svg';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Textarea, Card } from '@components/ui';
import { ITEM_CATEGORIES } from '@constants/categories';
import { useCreateReport } from '@hooks/useReports';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import { CreateReportFormData, CreateReportFormValues } from '../types/createReport.types';
import { CreateLostReportData } from '../types/report.types';
import { createReportFormSchema } from '../validators';



const CreateReport = () => {
  const navigate = useNavigate();
  const { createReport, isSubmitting } = useCreateReport();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: yupResolver(createReportFormSchema) as unknown as Resolver<CreateReportFormValues>,
    defaultValues: {
      identifyingFeatures: [],
      contactEmail: user?.email || '',
      dateLost: new Date().toISOString().split('T')[0],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'identifyingFeatures',
  });

  const onSubmit = async (data: CreateReportFormValues) => {
    const submissionData: CreateLostReportData = {
      ...data,
      dateLost: new Date(data.dateLost).toISOString(),
      identifyingFeatures: data.identifyingFeatures.map(f => f.text),
      category: data.category,
    };

    await createReport(submissionData);
  };

  return (
    <ComponentErrorBoundary title="Submit Report Error">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Lost Report</h1>
          <p className="text-gray-600 mt-1">
            Report your lost item and we'll notify you if we find a match
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Item Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Item Information
            </h2>
            <div className="space-y-4">
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
                    value: key,
                    label: cat.label,
                  })),
                ]}
                error={errors.category?.message}
                fullWidth
                required
                {...register('category')}
              />

              <Textarea
                label="Description"
                placeholder="Describe your lost item in detail (brand, color, model, unique features, etc.)"
                helperText="Be as specific as possible to help us match it with found items"
                error={errors.description?.message}
                fullWidth
                required
                rows={4}
                {...register('description')}
              />
            </div>
          </Card>

          {/* Loss Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Where and When Did You Lose It?
            </h2>
            <div className="space-y-4">
              <Input
                label="Location Lost"
                placeholder="e.g., Main Library, Student Center"
                helperText="Where did you last see or use this item?"
                error={errors.locationLost?.message}
                fullWidth
                required
                {...register('locationLost')}
              />

              <Input
                label="Date Lost"
                type="date"
                helperText="Approximate date when you lost the item"
                error={errors.dateLost?.message}
                fullWidth
                required
                {...register('dateLost')}
              />
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information (Optional)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              We'll use your account email by default, but you can provide alternative contact details
            </p>
            <div className="space-y-4">
              <Input
                label="Alternative Email"
                type="email"
                placeholder="your@email.com"
                error={errors.contactEmail?.message}
                fullWidth
                {...register('contactEmail')}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="1234567890"
                helperText="10 digits"
                error={errors.contactPhone?.message}
                fullWidth
                {...register('contactPhone')}
              />
            </div>
          </Card>

          {/* Identifying Features */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Identifying Features
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add specific details that help identify your item (e.g., "scratch on back", "sticker on lid").
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                 <Input
                    id="feature-input"
                    placeholder="Enter a feature and press Add"
                    fullWidth
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value) {
                          append({ text: value });
                          input.value = '';
                        }
                      }
                    }}
                 />
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                       const input = document.getElementById('feature-input') as HTMLInputElement;
                       const value = input.value.trim();
                       if (value) {
                          append({ text: value });
                          input.value = '';
                       }
                    }}
                 >
                    Add
                 </Button>
              </div>
              
              {errors.identifyingFeatures && (
                <p className="text-sm text-red-600">{errors.identifyingFeatures.message}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm text-gray-700">{field.text}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove feature"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                   <p className="text-sm text-gray-500 italic">No features added yet. Please add at least one.</p>
                )}
              </div>
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <InfoIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  What Happens Next?
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>We'll automatically search for matching found items</li>
                  <li>You'll receive email notifications for high-confidence matches</li>
                  <li>You can view all potential matches on your report page</li>
                  <li>If you find your item, you can file a claim directly</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/reports')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </ComponentErrorBoundary>
  );
};

export default CreateReport;
