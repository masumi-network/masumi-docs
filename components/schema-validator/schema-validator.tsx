'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export const EXAMPLES = [
    {
      label: 'Multiple Fields (Default)',
      value: `[
    {
      "id": "name",
      "type": "string",
      "name": "Full Name",
      "data": {
        "placeholder": "Enter your full name",
        "description": "Your complete name as it appears on official documents"
      },
      "validations": [
        { "validation": "min", "value": "2" },
        { "validation": "max", "value": "100" }
      ]
    },
    {
      "id": "email",
      "type": "string",
      "name": "Email Address",
      "data": {
        "placeholder": "your.email@example.com",
        "description": "Your primary email address"
      },
      "validations": [
        { "validation": "format", "value": "email" }
      ]
    },
    {
      "id": "age",
      "type": "number",
      "name": "Age",
      "data": {
        "description": "Your current age (optional)"
      },
      "validations": [
        { "validation": "min", "value": "18" },
        { "validation": "max", "value": "120" },
        { "validation": "format", "value": "integer" }
      ]
    },
    {
      "id": "interests",
      "type": "option",
      "name": "Interests",
      "data": {
        "description": "Select your areas of interest",
        "values": ["Technology", "Sports", "Music", "Art", "Science", "Travel"]
      },
      "validations": [
        { "validation": "min", "value": "1" },
        { "validation": "max", "value": "3" }
      ]
    },
    {
      "id": "newsletter",
      "type": "boolean",
      "name": "Newsletter Subscription",
      "data": {
        "description": "Subscribe to our newsletter for updates (optional)"
      }
    }
  ]`,
    },
    {
      label: 'String Input',
      value: `{
    "id": "email-input",
    "type": "string",
    "name": "Email",
    "data": {
      "placeholder": "Enter your email",
      "description": "User email address"
    },
    "validations": [
      { "validation": "format", "value": "email" },
      { "validation": "min", "value": "5" },
      { "validation": "max", "value": "55" }
    ]
  }`,
    },
    {
      label: 'Number Input',
      value: `{
    "id": "age-input",
    "type": "number",
    "name": "Age",
    "data": {
      "description": "User's age in years (optional)"
    },
    "validations": [
      { "validation": "min", "value": "18" },
      { "validation": "max", "value": "120" },
      { "validation": "format", "value": "integer" }
    ]
  }`,
    },
    {
      label: 'Option Input',
      value: `{
    "id": "company-type",
    "type": "option",
    "name": "Company type",
    "data": {
      "description": "Please select the legal entity to analyze",
      "values": ["AG", "GmbH", "UG"]
    },
    "validations": [
      { "validation": "min", "value": "1" },
      { "validation": "max", "value": "1" }
    ]
  }`,
    },
    {
      label: 'Boolean Input',
      value: `{
    "id": "terms-accepted",
    "type": "boolean",
    "name": "Accept Terms",
    "data": {
      "description": "I agree to the terms and conditions"
    }
  }`,
    },
    {
      label: 'File Input',
      value: `{
    "id": "document-upload",
    "type": "file",
    "name": "Document Upload",
    "data": {
      "accept": ".pdf,.doc,.docx",
      "maxSize": "10485760",
      "description": "PDF or Word documents only (max 10MB)",
      "outputFormat": "base64"
    }
  }`,
    },
    {
      label: 'With Optional Wrapper',
      value: `{
    "input_data": [
      {
        "id": "project-name",
        "type": "string",
        "name": "Project Name",
        "data": {
          "placeholder": "Enter project name",
          "description": "The name of your project"
        },
        "validations": [
          { "validation": "min", "value": "3" },
          { "validation": "max", "value": "50" }
        ]
      },
      {
        "id": "description",
        "type": "string", 
        "name": "Description",
        "data": {
          "placeholder": "Describe your project",
          "description": "Brief description of the project (optional)"
        },
        "validations": [
          { "validation": "max", "value": "500" }
        ]
      },
      {
        "id": "document",
        "type": "file",
        "name": "Project Document",
        "data": {
          "description": "Upload project documentation (PDF/Word, max 4.5MB)",
          "outputFormat": "string"
        }
      },
      {
        "id": "priority",
        "type": "option",
        "name": "Priority Level",
        "data": {
          "description": "Select the priority level",
          "values": ["Low", "Medium", "High", "Critical"]
        },
        "validations": [
          { "validation": "min", "value": "1" },
          { "validation": "max", "value": "1" }
        ]
      }
    ]
  }`,
    },
  ];
  
  


const SchemaPlayground = dynamic(
  async () =>
    (await import('masumi-schema-validator-component')).SchemaPlayground,
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse bg-muted/20 rounded-lg border border-muted flex items-center justify-center">
        <span className="text-muted-foreground">Loading Validator...</span>
      </div>
    ),
  },
);

export const SchemaValidator = () => {
  return (
    <SchemaPlayground 
      examples={EXAMPLES}
      initialSchema={EXAMPLES[0].value}
      onSchemaChange={() => {}}
    />
  );
};

export default SchemaValidator;
