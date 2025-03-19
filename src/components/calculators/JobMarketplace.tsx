
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, XCircle, AlertCircle } from 'lucide-react';

interface JobMarketplaceProps {
  isActive: boolean;
}

interface Job {
  id: number;
  company: string;
  route: string;
  type: string;
  payment: string;
  contact: string;
  description: string;
  date: string;
}

interface Driver {
  id: number;
  name: string;
  experience: string;
  license: string;
  region: string;
  contact: string;
  availability: string;
  date: string;
}

interface JobForm {
  company: string;
  route: string;
  type: string;
  payment: string;
  contact: string;
  description: string;
}

interface DriverForm {
  name: string;
  experience: string;
  license: string;
  region: string;
  contact: string;
  availability: string;
}

const JobMarketplace = ({ isActive }: JobMarketplaceProps) => {
  // State for job listings
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // State for forms
  const [jobForm, setJobForm] = useState<JobForm>({
    company: '',
    route: '',
    type: 'frete',
    payment: '',
    contact: '',
    description: ''
  });
  
  const [driverForm, setDriverForm] = useState<DriverForm>({
    name: '',
    experience: '',
    license: 'B',
    region: '',
    contact: '',
    availability: 'integral'
  });
  
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedJobs = localStorage.getItem('fretesimples_jobs');
      const savedDrivers = localStorage.getItem('fretesimples_drivers');
      
      if (savedJobs) {
        try {
          setJobs(JSON.parse(savedJobs));
        } catch (e) {
          console.error('Error parsing saved jobs', e);
        }
      }
      
      if (savedDrivers) {
        try {
          setDrivers(JSON.parse(savedDrivers));
        } catch (e) {
          console.error('Error parsing saved drivers', e);
        }
      }
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fretesimples_jobs', JSON.stringify(jobs));
      localStorage.setItem('fretesimples_drivers', JSON.stringify(drivers));
    }
  }, [jobs, drivers]);
  
  // Handle job form changes
  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle driver form changes
  const handleDriverFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new job
  const addJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobForm.company || !jobForm.route || !jobForm.payment || !jobForm.contact) {
      return; // Don't add incomplete entries
    }
    
    const newJob: Job = {
      ...jobForm,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setJobs(prev => [newJob, ...prev]);
    
    // Reset form
    setJobForm({
      company: '',
      route: '',
      type: 'frete',
      payment: '',
      contact: '',
      description: ''
    });
  };
  
  // Add new driver
  const addDriver = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driverForm.name || !driverForm.experience || !driverForm.region || !driverForm.contact) {
      return; // Don't add incomplete entries
    }
    
    const newDriver: Driver = {
      ...driverForm,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setDrivers(prev => [newDriver, ...prev]);
    
    // Reset form
    setDriverForm({
      name: '',
      experience: '',
      license: 'B',
      region: '',
      contact: '',
      availability: 'integral'
    });
  };
  
  // Remove a job
  const removeJob = (id: number) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };
  
  // Remove a driver
  const removeDriver = (id: number) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };
  
  return (
    <Calculator
      id="marketplace"
      title="Marketplace de Vagas para Motoristas"
      description="Encontre ou anuncie vagas para motoristas e transportadores."
      isActive={isActive}
    >
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'jobs' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            Vagas disponíveis
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'drivers' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Motoristas disponíveis
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'add' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('add')}
          >
            Adicionar anúncio
          </button>
        </div>
      </div>
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vagas disponíveis</h3>
            
            {jobs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Nenhuma vaga disponível no momento.</p>
                <button
                  className="mt-4 btn btn-small btn-primary"
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar uma vaga
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div 
                    key={job.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.company}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-frete-100 text-frete-800">
                            {job.type === 'frete' ? 'Frete' : job.type === 'fixo' ? 'Emprego Fixo' : 'Temporário'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.date}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeJob(job.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-sm text-gray-500">Rota/Local:</span>
                        <p className="text-gray-800">{job.route}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Valor/Salário:</span>
                        <p className="text-gray-800">{job.payment}</p>
                      </div>
                    </div>
                    
                    {job.description && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">Descrição:</span>
                        <p className="text-gray-700 text-sm mt-1">{job.description}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Contato: </span>
                        <span className="font-medium text-gray-900">{job.contact}</span>
                      </div>
                      <a
                        href={`https://wa.me/${job.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-small btn-primary bg-green-500 hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Motoristas disponíveis</h3>
            
            {drivers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Nenhum motorista disponível no momento.</p>
                <button
                  className="mt-4 btn btn-small btn-primary"
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar perfil de motorista
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {drivers.map(driver => (
                  <div 
                    key={driver.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{driver.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {`CNH ${driver.license}`}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {driver.availability === 'integral' ? 'Tempo Integral' : driver.availability === 'parcial' ? 'Tempo Parcial' : 'Fins de semana'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {driver.date}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeDriver(driver.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-sm text-gray-500">Experiência:</span>
                        <p className="text-gray-800">{driver.experience}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Região:</span>
                        <p className="text-gray-800">{driver.region}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Contato: </span>
                        <span className="font-medium text-gray-900">{driver.contact}</span>
                      </div>
                      <a
                        href={`https://wa.me/${driver.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-small btn-primary bg-green-500 hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Add Listing Tab */}
      {activeTab === 'add' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar anúncio</h3>
            
            <div className="mb-4">
              <div className="flex rounded-md overflow-hidden border border-gray-200">
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'add' && jobForm.company !== undefined
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    setJobForm({
                      company: '',
                      route: '',
                      type: 'frete',
                      payment: '',
                      contact: '',
                      description: ''
                    });
                    setDriverForm({
                      name: '',
                      experience: '',
                      license: 'B',
                      region: '',
                      contact: '',
                      availability: 'integral'
                    });
                  }}
                >
                  Anunciar vaga
                </button>
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'add' && driverForm.name !== undefined
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    setDriverForm({
                      name: '',
                      experience: '',
                      license: 'B',
                      region: '',
                      contact: '',
                      availability: 'integral'
                    });
                    setJobForm({
                      company: '',
                      route: '',
                      type: 'frete',
                      payment: '',
                      contact: '',
                      description: ''
                    });
                  }}
                >
                  Perfil de motorista
                </button>
              </div>
            </div>
            
            {/* Job Form */}
            {jobForm && (
              <form onSubmit={addJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa/Nome *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="input-field"
                      value={jobForm.company}
                      onChange={handleJobFormChange}
                      placeholder="Nome da empresa ou pessoa"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                      Rota/Local *
                    </label>
                    <input
                      type="text"
                      id="route"
                      name="route"
                      required
                      className="input-field"
                      value={jobForm.route}
                      onChange={handleJobFormChange}
                      placeholder="Ex: São Paulo - Rio de Janeiro"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de vaga
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="select-field"
                      value={jobForm.type}
                      onChange={handleJobFormChange}
                    >
                      <option value="frete">Frete</option>
                      <option value="fixo">Emprego Fixo</option>
                      <option value="temporario">Temporário</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">
                      Valor/Salário *
                    </label>
                    <input
                      type="text"
                      id="payment"
                      name="payment"
                      required
                      className="input-field"
                      value={jobForm.payment}
                      onChange={handleJobFormChange}
                      placeholder="Ex: R$ 2.500,00 ou R$ 1.200 por viagem"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contato (telefone) *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="input-field"
                      value={jobForm.contact}
                      onChange={handleJobFormChange}
                      placeholder="Ex: (11) 98765-4321"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição (opcional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="input-field"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      placeholder="Detalhe o serviço, requisitos, benefícios, etc."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    Publicar vaga
                  </button>
                </div>
              </form>
            )}
            
            {/* Driver Form */}
            {driverForm && (
              <form onSubmit={addDriver} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="input-field"
                      value={driverForm.name}
                      onChange={handleDriverFormChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria da CNH
                    </label>
                    <select
                      id="license"
                      name="license"
                      className="select-field"
                      value={driverForm.license}
                      onChange={handleDriverFormChange}
                    >
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experiência *
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      required
                      className="input-field"
                      value={driverForm.experience}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: 5 anos como motorista de caminhão"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Região de atuação *
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      required
                      className="input-field"
                      value={driverForm.region}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: Grande São Paulo, Nordeste, Todo Brasil"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contato (telefone) *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="input-field"
                      value={driverForm.contact}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: (11) 98765-4321"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      className="select-field"
                      value={driverForm.availability}
                      onChange={handleDriverFormChange}
                    >
                      <option value="integral">Tempo Integral</option>
                      <option value="parcial">Tempo Parcial</option>
                      <option value="fds">Fins de semana</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    Publicar perfil
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-800 text-sm">
            <p className="flex items-start gap-2">
              <AlertCircle className="shrink-0 text-yellow-500 mt-0.5" size={18} />
              <span>
                Este é um marketplace simples armazenado apenas no seu navegador. As informações não são enviadas 
                para um servidor e ficarão salvas apenas neste dispositivo.
              </span>
            </p>
          </div>
        </>
      )}
    </Calculator>
  );
};

export default JobMarketplace;
