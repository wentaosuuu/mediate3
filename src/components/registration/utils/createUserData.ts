import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData } from "@/types/registration";

export const createTenantRegistration = async (
  formData: RegistrationFormData,
  tenantId: string
) => {
  const { error } = await supabase
    .from('tenant_registrations')
    .insert([{
      tenant_id: tenantId,
      contact_person: formData.contactPerson,
      phone: formData.phone,
      company_name: formData.companyName,
      username: formData.username,
      social_credit_code: formData.socialCreditCode,
      address: formData.address || null,
      company_intro: formData.companyIntro || null,
      remarks: formData.remarks || null,
      business_email: formData.businessEmail || null,
    }]);

  return { error };
};