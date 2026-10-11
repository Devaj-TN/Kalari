import type { Branch } from '../types';

// Placeholder data — replace with Laravel API call in useBranches() hook
const BRANCHES_DATA: Branch[] = [
  {
    id: '1',
    name: 'Madhurakandy C.V.N Kalari',
    address: 'Madhura kandy, CVN KALARI, Vengeri',
    city: 'Kozhikode',
    state: 'Kerala',
    pincode: '673010',
    phone: '+91 99471 39696',
    whatsapp: '+919947139696',
    email: 'info@madhurakandykalari.com',
    mapUrl: 'https://maps.google.com/?q=11.2980,75.7950',
    embedUrl:
      'https://maps.google.com/maps?q=Madhura+kandy+CVN+KALARI+Vengeri+Kozhikode+Kerala+673010&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: 'Daily: 5:30 AM–8:30 PM | Special Sunday Clinics',
    geoLat: 11.2980,
    geoLng: 75.7950,
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Kalari Academy — South Campus',
    address: '7, Guruvayoor Road, Palayam',
    city: 'Thrissur',
    state: 'Kerala',
    pincode: '680001',
    phone: '+91 487 244 6180',
    whatsapp: '+919876543211',
    email: 'thrissur@kalariacademy.in',
    mapUrl: 'https://maps.google.com/?q=10.5276,76.2144',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.0!2d76.2144!3d10.5276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMxJzM5LjQiTiA3NsKwMTInNTEuOCJF!5e0!3m2!1sen!2sin!4v1',
    hours: 'Mon–Sat: 5:30 AM–8:00 PM | Sun: Closed',
    geoLat: 10.5276,
    geoLng: 76.2144,
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Kalari Academy — North Centre',
    address: '23, Beach Road Junction, Fort Area',
    city: 'Kannur',
    state: 'Kerala',
    pincode: '670001',
    phone: '+91 497 270 5520',
    whatsapp: '+919876543212',
    email: 'kannur@kalariacademy.in',
    mapUrl: 'https://maps.google.com/?q=11.8745,75.3704',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3906.0!2d75.3704!3d11.8745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDUyJzI4LjIiTiA3NcKwMjInMTMuNCJF!5e0!3m2!1sen!2sin!4v1',
    hours: 'Mon–Sat: 6:00 AM–7:30 PM | Sun: 7:00 AM–11:00 AM',
    geoLat: 11.8745,
    geoLng: 75.3704,
    isPrimary: false,
  },
];

export default BRANCHES_DATA;
