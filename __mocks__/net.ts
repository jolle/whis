import { EventEmitter } from 'events';

const net = jest.createMockFromModule('net') as typeof import('net');

const ECONNRESET_HOST = 'econnreset.local';

net.Socket = class Socket extends EventEmitter {
  writable: boolean = false;
  private host?: string;

  constructor() {
    super();
  }

  connect(port: number, host: string, callback: Function) {
    this.host = host;
    this.writable = true;

    if (host === ECONNRESET_HOST) {
      setTimeout(() => this.emit('error', Error('read ECONNRESET')), 1);
    }

    callback();
  }

  write(data: unknown) {
    if (this.host === ECONNRESET_HOST) {
      return;
    }

    setTimeout(() => {
      this.emit(
        'data',
        Buffer.from(
          '% IANA WHOIS server\n% for more information on IANA, visit http://www.iana.org\n% This query returned 1 object\n\nrefer:        whois.nic.io\n\ndomain:       IO\n\norganisation: IO Top Level Domain Registry\norganisation: Cable and Wireless\naddress:      Diego Garcia\naddress:      British Indian Ocean Territory\n\ncontact:      administrative\nname:         Internet Administrator\norganisation: IO Top Level Domain Registry\norganisation: Cable and Wireless\naddress:      Diego Garcia\naddress:      British Indian Ocean Territory\nphone:        +246 9398\nfax-no:       +246 9398\ne-mail:       administrator@nic.io\n\ncontact:      technical\nname:         Administrator\norganisation: ICB Plc.\naddress:      9 Queens Road\naddress:      Bournemouth Dorset BH2 6BA\naddress:      United Kingdom\nfax-no:       +44 1225 580 550\ne-mail:       admin@icb.co.uk\n\nnserver:      A0.NIC.IO 2a01:8840:9e:0:0:0:0:17 65.22.160.17\nnserver:      A2.NIC.IO 2a01:8840:a1:0:0:0:0:17 65.22.163.17\nnserver:      B0.NIC.IO 2a01:8840:9f:0:0:0:0:17 65.22.161.17\nnserver:      C0.NIC.IO 2a01:8840:a0:0:0:0:0:17 65.22.162.17\nnserver:      NS-A1.IO 194.0.1.1 2001:678:4:0:0:0:0:1\nnserver:      NS-A3.IO 74.116.178.1\nds-rdata:     64744 8 2 2E7D661097A76EAC145858E4FF8F3DDAE5EAEDFD527725BC6F8A943E4FE23A29\nds-rdata:     57355 8 2 95a57c3bab7849dbcddf7c72ada71a88146b141110318ca5be672057e865c3e2\nds-rdata:     57355 8 1 434e91e206134f5b3b0ac603b26f5e029346abc9\n\nwhois:        whois.nic.io\n\nstatus:       ACTIVE\nremarks:      Registration information: http://www.nic.io/\n\ncreated:      1997-09-16\nchanged:      2017-10-21\nsource:       IANA\n\nDomain Name: JOLLE.IO\nRegistry Domain ID: D503300000040445888-LRMS\nRegistrar WHOIS Server: whois.namecheap.com\nRegistrar URL: www.namecheap.com\nUpdated Date: 2018-08-19T15:07:30Z\nCreation Date: 2016-09-03T08:40:13Z\nRegistry Expiry Date: 2019-09-03T08:40:13Z\nRegistrar Registration Expiration Date:\nRegistrar: NameCheap, Inc\nRegistrar IANA ID: 1068\nRegistrar Abuse Contact Email: abuse@namecheap.com\nRegistrar Abuse Contact Phone: +1.6613102107\nReseller:\nDomain Status: ok https://icann.org/epp#ok\nRegistrant Organization: WhoisGuard, Inc.\nRegistrant State/Province: Panama\nRegistrant Country: PA\nName Server: TOM.NS.CLOUDFLARE.COM\nName Server: CAROL.NS.CLOUDFLARE.COM\nDNSSEC: unsigned\nURL of the ICANN Whois Inaccuracy Complaint Form is https://www.icann.org/wicf/\n>>> Last update of WHOIS database: 2018-09-07T18:17:34Z <<<\n\nDomain name: jolle.io\nRegistry Domain ID: D503300000040445888-LRMS\nRegistrar WHOIS Server: whois.namecheap.com\nRegistrar URL: http://www.namecheap.com\nUpdated Date: 2018-08-19T15:07:30.16Z\nCreation Date: 2016-09-03T08:40:13.00Z\nRegistrar Registration Expiration Date: 2019-09-03T08:40:13.00Z\nRegistrar: NAMECHEAP INC\nRegistrar IANA ID: 1068\nRegistrar Abuse Contact Email: abuse@namecheap.com\nRegistrar Abuse Contact Phone: +1.6613102107\nReseller: NAMECHEAP INC\nDomain Status: ok https://icann.org/epp#ok\nRegistry Registrant ID: k0ze25v3ttofka4h\nRegistrant Name: WhoisGuard Protected\nRegistrant Organization: WhoisGuard, Inc.\nRegistrant Street: P.O. Box 0823-03411\nRegistrant City: Panama\nRegistrant State/Province: Panama\nRegistrant Postal Code:\nRegistrant Country: PA\nRegistrant Phone: +507.8365503\nRegistrant Phone Ext:\nRegistrant Fax: +51.17057182\nRegistrant Fax Ext:\nRegistrant Email: fd77efec631b4a14a1bdd01d5109dad9.protect@whoisguard.com\nRegistry Admin ID: zaygrhbr3b1gbczg\nAdmin Name: WhoisGuard Protected\nAdmin Organization: WhoisGuard, Inc.\nAdmin Street: P.O. Box 0823-03411\nAdmin City: Panama\nAdmin State/Province: Panama\nAdmin Postal Code:\nAdmin Country: PA\nAdmin Phone: +507.8365503\nAdmin Phone Ext:\nAdmin Fax: +51.17057182\nAdmin Fax Ext:\nAdmin Email: fd77efec631b4a14a1bdd01d5109dad9.protect@whoisguard.com\nRegistry Tech ID: cjzhzzqixan11m5d\nTech Name: WhoisGuard Protected\nTech Organization: WhoisGuard, Inc.\nTech Street: P.O. Box 0823-03411\nTech City: Panama\nTech State/Province: Panama\nTech Postal Code:\nTech Country: PA\nTech Phone: +507.8365503\nTech Phone Ext:\nTech Fax: +51.17057182\nTech Fax Ext:\nTech Email: fd77efec631b4a14a1bdd01d5109dad9.protect@whoisguard.com\nName Server: tom.ns.cloudflare.com\nName Server: carol.ns.cloudflare.com\nDNSSEC: unsigned\nURL of the ICANN WHOIS Data Problem Reporting System: http://wdprs.internic.net/',
        ),
      );

      setTimeout(() => {
        this.emit('close');
      }, 10);
    }, 10);
  }
} as typeof net.Socket;

module.exports = net;
