import fs from "fs";

const getMetadataFileText = (entityId: string, assertionConsumerService: string) => `
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${entityId}">
<SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:1.1:protocol urn:oasis:names:tc:SAML:2.0:protocol">
<NameIDFormat>
urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
</NameIDFormat>
<AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${assertionConsumerService}" index="1"/>
</SPSSODescriptor>
<ContactPerson contactType="technical">
<GivenName>Administrator</GivenName>
<EmailAddress>noreply@example.org</EmailAddress>
</ContactPerson>
</EntityDescriptor>
`;

async function createMetadataFile(entityId: string, assertionConsumerService: string){
	if(this.file)
		return this.file;
	fs.writeFileSync('./metadata.xml',getMetadataFileText(entityId, assertionConsumerService));
	this.file = './metadata.xml';
	return this.file;
}

export { createMetadataFile }