import { useEffect, useState } from 'react';
import { JSONParse } from 'json-with-bigint';

interface SelectorProps {
  onSelected: (data: any) => void;
}

interface SavedSample {
  id: string;
  name: string;
  schema: any;
  uiSchema: any;
  formData: any;
}

const SavedSampleSelector = ({ onSelected }: SelectorProps) => {
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  useEffect(() => {
    const savedSampleKeys = localStorage.getItem('savedSampleKeys');
    if (savedSampleKeys) {
      setSamples(JSONParse(savedSampleKeys));
    }
  }, []);

  const handleSampleClick = (sampleId: string) => {
    return (event: MouseEvent) => {
      event.preventDefault();
      setSelectedSampleId(sampleId);
      setTimeout(() => {
        const savedSample = JSONParse(localStorage.getItem('savedSimples.' + sampleId) || '{}');
        onSelected(savedSample);
      }, 0);
    };
  };

  return (
    <>
      <div>
        <h4>保存的示例</h4>
      </div>
      <hr />
      {(samples.length > 0 && (
        <ul>
          {samples.map((sample: SavedSample) => (
            <li
              key={sample.id}
              onClick={() => handleSampleClick(sample.id)}
              className={selectedSampleId === sample.id ? 'active' : ''}
            >
              {sample.name}
            </li>
          ))}
        </ul>
      )) || <span style={{ color: 'gray' }}>没有保存的示例</span>}
    </>
  );
};

export default SavedSampleSelector;
