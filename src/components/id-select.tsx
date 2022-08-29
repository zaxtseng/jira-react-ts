import { Select } from 'antd';
import { Row } from 'types';

type SelectProps = React.ComponentProps<typeof Select>;
interface IdSelectProps
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'defaultOptionName' | 'options'
  > {
  value: Row | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
/**
 * value可以传入多种类型的值
 * onChange只会回调 number|undefined 类型
 * 当 isNaN(Number(value))为true的时候,即选项为undefined的时候,代表默认类型
 * 当默认选项时,onChange会回调undefined
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
