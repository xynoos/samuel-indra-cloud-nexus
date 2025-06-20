
interface EmailParams {
  to_email: string;
  to_name: string;
  otp_code: string;
  subject: string;
}

export const sendEmailWithEmailJS = async (params: EmailParams) => {
  try {
    // EmailJS configuration - you'll need to set up a free account at emailjs.com
    const serviceId = 'service_gmail'; // Replace with your EmailJS service ID
    const templateId = 'template_otp'; // Replace with your EmailJS template ID
    const publicKey = 'your_public_key'; // Replace with your EmailJS public key

    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      otp_code: params.otp_code,
      subject: params.subject,
      from_name: 'SamuelIndraBastian Cloud',
      message: `Halo ${params.to_name}, kode verifikasi Anda adalah: ${params.otp_code}. Kode berlaku selama 5 menit.`
    };

    // For now, we'll just log the email details
    console.log('Email would be sent with EmailJS:', templateParams);
    
    // Simulate successful sending
    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('EmailJS sending failed:', error);
    throw new Error('Failed to send email via EmailJS');
  }
};
