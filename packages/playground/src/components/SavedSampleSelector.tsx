import { useEffect, useState, MouseEvent } from 'react';
import { JSONParse } from 'json-with-bigint';

interface SelectorProps {
  onSelected: (data: any) => void;
  onSelectedName: (name: string) => void;
}

interface SavedSample {
  id: string;
  name: string;
  schema: any;
  uiSchema: any;
  formData: any;
}

const SavedSampleSelector = ({ onSelected, onSelectedName }: SelectorProps) => {
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
        const savedSample = JSONParse(localStorage.getItem('savedSamples.' + sampleId) || '{}');
        onSelected(savedSample);
        onSelectedName(savedSample.name);
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
        <ul className='nav nav-pills'>
          {samples.map((sample: SavedSample) => (
            <li key={sample.id} role='presentation' className={selectedSampleId === sample.id ? 'active' : ''}>
              <a href='#' onClick={handleSampleClick(sample.id)}>
                {sample.name}
              </a>
            </li>
          ))}
        </ul>
      )) || <span style={{ color: 'gray' }}>没有保存的示例</span>}
    </>
  );
};

export default SavedSampleSelector;
