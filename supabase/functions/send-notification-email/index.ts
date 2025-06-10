
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'new_lead' | 'high_risk' | 'follow_up';
  recipientEmail: string;
  data: {
    leadName?: string;
    leadEmail?: string;
    riskLevel?: string;
    toolType?: string;
    message?: string;
  };
}

const getEmailTemplate = (type: string, data: any) => {
  switch (type) {
    case 'new_lead':
      return {
        subject: '🚀 Novo Lead Cadastrado - FreteDigital CCI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">FreteDigital CCI</h1>
              <p style="color: white; margin: 5px 0;">Sistema de Gestão de Leads</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">🎯 Novo Lead Cadastrado!</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h3 style="color: #333; margin-top: 0;">Informações do Lead:</h3>
                <p><strong>Nome:</strong> ${data.leadName || 'Não informado'}</p>
                <p><strong>Email:</strong> ${data.leadEmail || 'Não informado'}</p>
                <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://frete-simples.com/admin" 
                   style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Acessar Painel Administrativo
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; background: #e9ecef;">
              <p>Este é um email automático do sistema FreteDigital CCI.</p>
            </div>
          </div>
        `
      };
      
    case 'high_risk':
      return {
        subject: '⚠️ Alerta: Diagnóstico de Alto Risco - FreteDigital CCI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">FreteDigital CCI</h1>
              <p style="color: white; margin: 5px 0;">Alerta de Alto Risco</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #dc3545; margin-bottom: 20px;">⚠️ Diagnóstico de Alto Risco Detectado!</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                <h3 style="color: #333; margin-top: 0;">Detalhes do Alerta:</h3>
                <p><strong>Lead:</strong> ${data.leadName || 'Não informado'}</p>
                <p><strong>Email:</strong> ${data.leadEmail || 'Não informado'}</p>
                <p><strong>Ferramenta:</strong> ${data.toolType || 'Não informado'}</p>
                <p><strong>Nível de Risco:</strong> <span style="color: #dc3545; font-weight: bold;">${data.riskLevel || 'Alto'}</span></p>
                <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;">
                  <strong>Ação Recomendada:</strong> Entre em contato com este lead imediatamente para oferecer consultoria especializada.
                </p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://frete-simples.com/admin" 
                   style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Ver Detalhes no Painel
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; background: #e9ecef;">
              <p>Este é um email automático do sistema FreteDigital CCI.</p>
            </div>
          </div>
        `
      };
      
    case 'follow_up':
      return {
        subject: '📞 Lembrete de Follow-up - FreteDigital CCI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">FreteDigital CCI</h1>
              <p style="color: white; margin: 5px 0;">Lembrete de Follow-up</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #856404; margin-bottom: 20px;">📞 Hora do Follow-up!</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p>${data.message || 'É hora de fazer o follow-up com um lead importante.'}</p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://frete-simples.com/admin" 
                   style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Acessar Lista de Leads
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; background: #e9ecef;">
              <p>Este é um email automático do sistema FreteDigital CCI.</p>
            </div>
          </div>
        `
      };
      
    default:
      return {
        subject: 'Notificação - FreteDigital CCI',
        html: '<p>Notificação do sistema FreteDigital CCI</p>'
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipientEmail, data }: NotificationEmailRequest = await req.json();

    if (!recipientEmail) {
      throw new Error("Email do destinatário é obrigatório");
    }

    const template = getEmailTemplate(type, data);

    const emailResponse = await resend.emails.send({
      from: "FreteDigital CCI <noreply@frete-simples.com>",
      to: [recipientEmail],
      subject: template.subject,
      html: template.html,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
