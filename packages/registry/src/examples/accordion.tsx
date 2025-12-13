import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/nativewind/components/ui/accordion';
import { Text } from '@/registry/nativewind/components/ui/text';

export function AccordionPreview() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-lg" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text>Product Information</Text>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            Our flagship product combines cutting-edge technology with sleek design. Built with
            premium materials, it offers unparalleled performance and reliability.
          </Text>
          <Text>
            Key features include advanced processing capabilities, and an intuitive user interface
            designed for both beginners and experts.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Text>Shipping Details</Text>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            We offer worldwide shipping through trusted courier partners. Standard delivery takes
            3-5 business days, while express shipping ensures delivery within 1-2 business days.
          </Text>
          <Text>
            All orders are carefully packaged and fully insured. Track your shipment in real-time
            through our dedicated tracking portal.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Text>Return Policy</Text>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            We stand behind our products with a comprehensive 30-day return policy. If you&apos;re
            not completely satisfied, simply return the item in its original condition.
          </Text>
          <Text>
            Our hassle-free return process includes free return shipping and full refunds processed
            within 48 hours of receiving the returned item.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
