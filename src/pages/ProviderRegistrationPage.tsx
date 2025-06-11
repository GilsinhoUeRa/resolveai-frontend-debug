import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import CheckboxGroup from '@/components/CheckboxGroup';
import Button from '@/components/Button';
import Modal from '@/components/Modal'; 
import MagicWandIcon from '@/components/icons/MagicWandIcon'; 
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { User, UserType, ProviderDetails, Specialty, PaymentMethod as PaymentMethodType, Profession, SubscriptionPlan } from '@/types';
import { APP_ROUTES, MOCK_PAYMENT_METHODS, PRICING_PLANS_DETAILS } from '@/constants';
import * as AdminDataService from '@/lib/adminDataService';
import { generateProviderBio } from '@/lib/geminiService'; 
import { isValidCPF, isValidCNPJ, formatCPF, formatCNPJ } from '@/lib/validators'; // Import validators

const ProviderRegistrationPage = (): JSX.Element => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isExistingProvider, setIsExistingProvider] = useState(false);
  const [formData, setFormData] = useState<Partial<ProviderDetails>>({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    whatsApp: '',
    profession: undefined,
    specialties: [],
    workingHours: '',
    paymentMethods: [],
    bio: '',
    photoUrl: user?.photoUrl || '',
    subscriptionPlan: (user as ProviderDetails)?.subscriptionPlan || 'free',
    documentType: undefined,
    documentNumber: '',
  });
  const [selectedProfessionId, setSelectedProfessionId] = useState<string>('');
  
  const [availableProfessions, setAvailableProfessions] = useState<Profession[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);

  const [formError, setFormError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoUrl || null);

  const [isBioAssistantModalOpen, setIsBioAssistantModalOpen] = useState(false);
  const [bioKeywords, setBioKeywords] = useState('');
  const [generatedBio, setGeneratedBio] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioAssistantError, setBioAssistantError] = useState<string | null>(null);

  const MAX_SPECIALTIES_BY_PLAN: Record<SubscriptionPlan, number> = {
    trial: 4,
    free: 2, 
    basic: 4,
    pro: 6,
    premium: 8,
  };
  const currentMaxSpecialties = user?.userType === UserType.PROVIDER ? MAX_SPECIALTIES_BY_PLAN[(user as ProviderDetails).subscriptionPlan || 'free'] : MAX_SPECIALTIES_BY_PLAN['free'];
  
  useEffect(() => {
    setAvailableProfessions(AdminDataService.getManagedProfessions().sort((a,b) => a.name.localeCompare(b.name)));
    setAvailableSpecialties(AdminDataService.getManagedSpecialties().sort((a,b) => a.name.localeCompare(b.name)));
  }, []);

  useEffect(() => {
    if (user && availableProfessions.length > 0) { 
      const isProvider = user.userType === UserType.PROVIDER;
      setIsExistingProvider(isProvider);
      const providerUser = user as ProviderDetails;

      if (isProvider) {
        const currentProfession = availableProfessions.find(p => p.id === providerUser.profession?.id);
        
        setFormData({
          name: providerUser.name,
          email: providerUser.email,
          city: providerUser.city,
          whatsApp: providerUser.whatsApp || '',
          profession: currentProfession, 
          specialties: providerUser.specialties?.slice(0, currentMaxSpecialties) || [], 
          workingHours: providerUser.workingHours || '',
          paymentMethods: providerUser.paymentMethods || [],
          bio: providerUser.bio || '',
          photoUrl: providerUser.photoUrl || '',
          subscriptionPlan: providerUser.subscriptionPlan || 'free',
          documentType: providerUser.documentType || undefined,
          documentNumber: providerUser.documentNumber || '',
        });
        setSelectedProfessionId(currentProfession?.id || '');
        setPhotoPreview(providerUser.photoUrl || null);
      } else { 
          setFormData(prev => ({
              ...prev,
              name: user.name,
              email: user.email,
              city: user.city,
              photoUrl: user.photoUrl,
              subscriptionPlan: 'free', 
          }));
          setPhotoPreview(user.photoUrl || null);
      }
    }
  }, [user, availableProfessions, currentMaxSpecialties]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "profession") {
        setSelectedProfessionId(value);
        const selectedProf = availableProfessions.find(p => p.id === value);
        setFormData(prev => ({ ...prev, profession: selectedProf ? { id: selectedProf.id, name: selectedProf.name, description: selectedProf.description } : undefined }));
    }
    if (name === "documentType") {
        setFormData(prev => ({ ...prev, documentNumber: '', documentType: value as 'cpf' | 'cnpj' | undefined }));
        setDocumentError(null);
    }
  };

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let numericValue = rawValue.replace(/\D/g, '');
    let formattedValue = rawValue;
    setDocumentError(null);

    if (formData.documentType === 'cpf') {
      if (numericValue.length > 11) numericValue = numericValue.slice(0, 11);
      formattedValue = formatCPF(numericValue);
    } else if (formData.documentType === 'cnpj') {
      if (numericValue.length > 14) numericValue = numericValue.slice(0, 14);
      formattedValue = formatCNPJ(numericValue);
    }
    setFormData(prev => ({ ...prev, documentNumber: formattedValue }));
  };

  const validateDocument = (): boolean => {
    if (!formData.documentType || !formData.documentNumber) {
        setDocumentError('Tipo e número do documento são obrigatórios para prestadores.');
        return false;
    }
    const cleanDocumentNumber = formData.documentNumber.replace(/\D/g, '');
    if (formData.documentType === 'cpf') {
        if (!isValidCPF(cleanDocumentNumber)) {
            setDocumentError('CPF inválido.');
            return false;
        }
    } else if (formData.documentType === 'cnpj') {
        if (!isValidCNPJ(cleanDocumentNumber)) {
            setDocumentError('CNPJ inválido.');
            return false;
        }
    }
    setDocumentError(null);
    return true;
  };


  const handleSpecialtyChange = (selectedIds: string[]) => {
    const currentSpecialtyError = `Você pode selecionar no máximo ${currentMaxSpecialties} especialidades com seu plano atual.`;
    if (selectedIds.length <= currentMaxSpecialties) {
      const selectedSpecs = availableSpecialties.filter(spec => selectedIds.includes(spec.id));
      setFormData(prev => ({ ...prev, specialties: selectedSpecs }));
      if (formError === currentSpecialtyError) {
        setFormError(null);
      }
    } else {
      setFormError(currentSpecialtyError);
      addToast(currentSpecialtyError, 'error');
       const limitedSelectedSpecs = availableSpecialties.filter(spec => selectedIds.slice(0, currentMaxSpecialties).includes(spec.id));
       setFormData(prev => ({ ...prev, specialties: limitedSelectedSpecs }));
    }
  };

  const handlePaymentMethodChange = (selectedIds: string[]) => {
    const selectedPay = MOCK_PAYMENT_METHODS.filter(pm => selectedIds.includes(pm.id));
    setFormData(prev => ({ ...prev, paymentMethods: selectedPay as PaymentMethodType[] }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setDocumentError(null);


    if (!user) {
        setFormError('Usuário não autenticado. Por favor, faça login.');
        addToast('Usuário não autenticado. Por favor, faça login.', 'error');
        setIsSubmitting(false);
        return;
    }

    if (!formData.profession || !formData.whatsApp || !formData.workingHours || (formData.specialties || []).length === 0 || (formData.paymentMethods || []).length === 0 || !formData.bio ) {
      setFormError('Por favor, preencha todos os campos obrigatórios destacados com *. (Sessão de Detalhes do Serviço e Operacional)');
      addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (!validateDocument()) {
        addToast(documentError || 'Documento inválido.', 'error');
        return;
    }
    
    if ((formData.specialties || []).length > currentMaxSpecialties) {
      const specialtyError = `Por favor, selecione no máximo ${currentMaxSpecialties} especialidades com seu plano atual.`;
      setFormError(specialtyError);
      addToast(specialtyError, 'error');
      return;
    }

    setIsSubmitting(true);

    const providerDataToSave: Partial<ProviderDetails> & { id: string; photoFile?: File | null } = {
      ...formData,
      id: user.id, 
      documentNumber: formData.documentNumber?.replace(/\D/g, ''), // Salva apenas números
      photoFile: photoFile,
      photoUrl: photoPreview || formData.photoUrl,
      userType: UserType.PROVIDER, 
      subscriptionPlan: (user as ProviderDetails).subscriptionPlan || 'free', 
      trialEndsAt: (user as ProviderDetails).trialEndsAt,
      subscriptionEndsAt: (user as ProviderDetails).subscriptionEndsAt,
      subscriptionCycle: (user as ProviderDetails).subscriptionCycle,
    };
    
    try {
      await updateUser(providerDataToSave);
      addToast(`Perfil de prestador ${isExistingProvider ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
      setTimeout(() => {
        if (user) { 
          navigate(`${APP_ROUTES.PROVIDER_PROFILE}/${user.id}`);
        } else {
          navigate(APP_ROUTES.HOME); 
        }
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao salvar o perfil. Tente novamente.';
      setFormError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBioAssistantModal = () => {
    setGeneratedBio('');
    setBioKeywords(formData.bio || ''); 
    setBioAssistantError(null);
    setIsBioAssistantModalOpen(true);
  };

  const closeBioAssistantModal = () => {
    setIsBioAssistantModalOpen(false);
  };

  const handleGenerateBio = async () => {
    if (!bioKeywords.trim()) {
      setBioAssistantError('Por favor, insira algumas palavras-chave ou uma breve descrição.');
      return;
    }
    setBioAssistantError(null);
    setIsGeneratingBio(true);
    setGeneratedBio('');
    try {
      const bio = await generateProviderBio(bioKeywords);
      setGeneratedBio(bio);
      addToast('Sugestão de biografia gerada com sucesso!', 'success');
    } catch (error: any) {
      const errorMessage = error.message || 'Ocorreu um erro ao gerar a biografia.';
      console.error("Bio generation error:", error);
      setBioAssistantError(errorMessage);
      addToast(errorMessage, 'error', 7000); 
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleUseGeneratedBio = () => {
    if (generatedBio) {
      setFormData(prev => ({ ...prev, bio: generatedBio }));
      addToast('Biografia preenchida com a sugestão da IA.', 'info');
    }
    closeBioAssistantModal();
  };
  
  if (authLoading && !user) {
    return <div className="text-center py-10">Carregando dados do usuário...</div>;
  }
  if (availableProfessions.length === 0 || availableSpecialties.length === 0) {
    return <div className="text-center py-10">Carregando opções de serviço...</div>;
  }

  const pageTitle = isExistingProvider ? 'Atualizar Perfil de Prestador' : 'Cadastro de Prestador de Serviços';
  const buttonText = isExistingProvider ? 'Salvar Alterações' : 'Concluir Cadastro de Prestador';
  const currentProviderPlan = (user as ProviderDetails)?.subscriptionPlan || 'free';
  const planName = PRICING_PLANS_DETAILS.find(p => p.id === currentProviderPlan)?.name || 
                   (currentProviderPlan === 'trial' ? 'Período de Teste' : 'Gratuito');

  const documentTypeOptions = [
    { value: '', label: 'Selecione o Tipo*' },
    { value: 'cpf', label: 'CPF (Pessoa Física)' },
    { value: 'cnpj', label: 'CNPJ (Pessoa Jurídica)' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-grafite-profundo">{pageTitle}</h1>
        <p className="text-lg text-cinza-neutro">Complete seu perfil para começar a receber contatos de clientes.</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-6">
        <div className="p-3 mb-6 bg-orange-energia/10 border-l-4 border-orange-energia rounded-md">
          <p className="text-sm text-orange-energia font-medium">
            Você está no plano: <span className="font-bold">{planName}</span>.
            Limite de especialidades: <span className="font-bold">{currentMaxSpecialties}</span>.
          </p>
          {(currentProviderPlan === 'free' || currentProviderPlan === 'trial') && (
            <p className="text-xs text-orange-energia/80 mt-1">
              Considere <Link to={APP_ROUTES.PRICING_PLANS} className="underline hover:font-semibold">fazer um upgrade</Link> para mais especialidades e benefícios.
            </p>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-grafite-profundo border-b pb-2 mb-6">Informações Básicas</h2>
        
        <Input label="Nome Completo (como será exibido)*" name="name" value={formData.name || ''} onChange={handleChange} required disabled={!!user?.name && !!formData.name} />
        <Input label="E-mail de Contato*" name="email" type="email" value={formData.email || ''} onChange={handleChange} required disabled={!!user?.email && !!formData.email} />
        <Input label="Cidade de Atuação*" name="city" value={formData.city || ''} onChange={handleChange} required disabled={!!user?.city && !!formData.city} />
        <Input label="WhatsApp (com DDD)*" name="whatsApp" type="tel" placeholder="(XX) XXXXX-XXXX" value={formData.whatsApp || ''} onChange={handleChange} required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
                label="Tipo de Documento*"
                name="documentType"
                options={documentTypeOptions}
                value={formData.documentType || ''}
                onChange={handleChange}
                required
            />
            <Input
                label="Número do Documento (CPF/CNPJ)*"
                name="documentNumber"
                value={formData.documentNumber || ''}
                onChange={handleDocumentNumberChange}
                onBlur={validateDocument}
                placeholder={formData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                required
                disabled={!formData.documentType}
                error={documentError || undefined}
            />
        </div>


        <div className="mt-6 pt-6 border-t">
            <h2 className="text-xl font-semibold text-grafite-profundo border-b pb-2 mb-6">Detalhes do Serviço</h2>
            
            <div>
                <label htmlFor="profession" className="block text-sm font-medium text-grafite-profundo mb-1">Profissão Principal*</label>
                <Select
                    name="profession"
                    id="profession"
                    options={availableProfessions.map(p => ({ value: p.id, label: p.name }))}
                    value={selectedProfessionId}
                    onChange={handleChange}
                    placeholder="Selecione sua profissão"
                    required
                    containerClassName="!mb-0"
                />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="bio" className="block text-sm font-medium text-grafite-profundo">Descreva seus serviços e experiência (Bio)*</label>
                <Button type="button" variant="ghost" size="sm" onClick={openBioAssistantModal} className="!text-xs !py-1">
                  <MagicWandIcon size={14} className="mr-1" /> Gerar com IA
                </Button>
              </div>
              <Textarea 
                id="bio"
                name="bio" 
                value={formData.bio || ''} 
                onChange={handleChange} 
                rows={5} 
                placeholder="Fale sobre você, suas qualificações, diferenciais, etc. Ou use o assistente de IA!" 
                required 
                containerClassName="!mb-0"
              />
            </div>


            <div className="mt-4">
                <label className="block text-sm font-medium text-grafite-profundo mb-1">Especialidades (selecione até {currentMaxSpecialties})*</label>
                <CheckboxGroup
                    options={availableSpecialties.map(spec => ({ id: spec.id, label: spec.name }))}
                    selectedValues={formData.specialties?.map(s => s.id) || []}
                    onChange={handleSpecialtyChange}
                    error={formError?.includes('especialidades') ? formError : undefined}
                    containerClassName="!mb-0"
                />
                <p className="text-xs text-cinza-neutro mt-1">Selecionadas: {(formData.specialties || []).length} de {currentMaxSpecialties}.</p>
            </div>
        </div>

        <div className="mt-6 pt-6 border-t">
            <h2 className="text-xl font-semibold text-grafite-profundo border-b pb-2 mb-6">Operacional</h2>
            <Input label="Horário de Atendimento*" name="workingHours" placeholder="Ex: Seg-Sex 9h-18h, Sáb 9h-12h" value={formData.workingHours || ''} onChange={handleChange} required />
            
            <CheckboxGroup
                label="Formas de Pagamento Aceitas*"
                options={MOCK_PAYMENT_METHODS.map(pm => ({ id: pm.id, label: pm.name }))}
                selectedValues={formData.paymentMethods?.map(pm => pm.id) || []}
                onChange={handlePaymentMethodChange}
            />
        </div>

        <div className="mt-6 pt-6 border-t">
            <h2 className="text-xl font-semibold text-grafite-profundo border-b pb-2 mb-6">Foto de Perfil</h2>
            <Input label="Upload de Foto" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
            {photoPreview && (
                <div className="mt-4">
                <img src={photoPreview} alt="Prévia da foto" className="w-32 h-32 rounded-full object-cover border-2 border-orange-energia" />
                </div>
            )}
        </div>

        {formError && !formError.includes('especialidades') && !documentError && 
            <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">{formError}</p>}
        
        <Button type="submit" isLoading={isSubmitting || authLoading} fullWidth variant="primary" size="lg" className="mt-8">
          {isSubmitting || authLoading ? 'Salvando...' : buttonText}
        </Button>
         <p className="text-xs text-cinza-neutro text-center mt-2">Campos marcados com * são obrigatórios.</p>
      </form>

      <Modal
        isOpen={isBioAssistantModalOpen}
        onClose={closeBioAssistantModal}
        title="Assistente de Biografia com IA"
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="ghost" onClick={closeBioAssistantModal} disabled={isGeneratingBio}>
              Fechar
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleGenerateBio} 
                isLoading={isGeneratingBio}
                disabled={!bioKeywords.trim() || isGeneratingBio}
            >
              {isGeneratingBio ? 'Gerando...' : (generatedBio ? 'Gerar Nova Sugestão' : 'Gerar Sugestão')}
            </Button>
            {generatedBio && !isGeneratingBio && (
              <Button variant="primary" onClick={handleUseGeneratedBio} disabled={isGeneratingBio}>
                Usar esta Biografia
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Descreva seus serviços, diferenciais ou cole sua bio atual (para refinar):"
            name="bioKeywords"
            value={bioKeywords}
            onChange={(e) => setBioKeywords(e.target.value)}
            placeholder="Ex: Eletricista com 10 anos de experiência, especializado em reparos rápidos e instalações seguras. Atendo em toda São Paulo. Orçamento sem compromisso."
            rows={4}
          />
          
          {bioAssistantError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{bioAssistantError}</p>}

          {isGeneratingBio && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-energia mx-auto"></div>
              <p className="text-sm text-orange-energia mt-2">Gerando sugestão de biografia...</p>
            </div>
          )}
          
          {generatedBio && !isGeneratingBio && (
            <div>
              <h3 className="text-md font-semibold text-grafite-profundo mb-1">Sugestão da IA:</h3>
              <Textarea
                name="generatedBioDisplay"
                value={generatedBio}
                readOnly
                rows={6}
                className="bg-light-bg/70 border-dashed"
              />
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default ProviderRegistrationPage;