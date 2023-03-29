import { Button, Classes, Menu, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemListRenderer, ItemRenderer, Select } from '@blueprintjs/select';
import { Chapter, Variant } from 'js-slang/dist/types';
// import { useSelector } from 'react-redux';
// import React, { useEffect} from 'react';
import { store } from 'src/pages/createStore';

import {
  defaultLanguages,
  fullJSLanguage,
  fullTSLanguage,
  htmlLanguage,
  pyLanguage,
  SALanguage,
  schemeLanguage,
  sourceLanguages,
  styliseSublanguage,
  variantLanguages
} from '../application/ApplicationTypes';
// import { getCurLang } from '../navigationBar/NavigationBarLangSelectButton';
// import type { RootState } from '../Store'
import Constants from '../utils/Constants';

type ControlBarChapterSelectProps = DispatchProps & StateProps;

type DispatchProps = {
  handleChapterSelect?: (i: SALanguage, e?: React.SyntheticEvent<HTMLElement>) => void;
};

type StateProps = {
  sourceChapter: Chapter;
  sourceVariant: Variant;
  disabled?: boolean;
};

const chapterListRendererA: ItemListRenderer<SALanguage> = ({ itemsParentRef, renderItem }) => {
  const defaultChoices = defaultLanguages.map(renderItem);
  const variantChoices = variantLanguages.map(renderItem);
  const fullJSChoice = renderItem(fullJSLanguage, 0);
  const fullTSChoice = renderItem(fullTSLanguage, 0);
  const htmlChoice = renderItem(htmlLanguage, 0);

  return (
    <Menu ulRef={itemsParentRef}>
      {defaultChoices}
      {Constants.playgroundOnly && fullJSChoice}
      {Constants.playgroundOnly && fullTSChoice}
      {Constants.playgroundOnly && htmlChoice}
      <MenuItem key="variant-menu" text="Variants" icon="cog">
        {variantChoices}
      </MenuItem>
    </Menu>
  );
};

const chapterListRendererB: ItemListRenderer<SALanguage> = ({ itemsParentRef, renderItem }) => {
  const defaultChoices = defaultLanguages.map(renderItem);
  const schemeChoice = renderItem(schemeLanguage, 0);
  return (
    <Menu ulRef={itemsParentRef}>
      {defaultChoices}
      {Constants.playgroundOnly && schemeChoice}
    </Menu>
  );
};

const chapterListRendererC: ItemListRenderer<SALanguage> = ({ itemsParentRef, renderItem }) => {
  const defaultChoices = defaultLanguages.map(renderItem);
  const pyChoice = renderItem(pyLanguage, 0);
  return (
    <Menu ulRef={itemsParentRef}>
      {defaultChoices}
      {Constants.playgroundOnly && pyChoice}
    </Menu>
  );
};

const chapterRenderer: ItemRenderer<SALanguage> = (lang, { handleClick }) => (
  <MenuItem key={lang.displayName} onClick={handleClick} text={lang.displayName} />
);

const ChapterSelectComponent = Select.ofType<SALanguage>();

export const ControlBarChapterSelect: React.FC<ControlBarChapterSelectProps> = ({
  sourceChapter,
  sourceVariant,
  handleChapterSelect = () => {},
  disabled = false
}) => {
  const selectedLang = store.getState().playground.lang;
  // const selectedLang = useSelector((state) => state)
  console.log('HELLO:', selectedLang);

  let chapterListRenderer: ItemListRenderer<SALanguage> = chapterListRendererA;
  // const [chapterListRenderer, setChapterListRenderer] = useState<ItemListRenderer<SALanguage>>(chapterListRendererA);

  // useEffect(() => {
  if (selectedLang === 'Source') {
    // setChapterListRenderer(chapterListRendererA);
    chapterListRenderer = chapterListRendererA;
  } else if (selectedLang === 'Scheme') {
    // setChapterListRenderer(chapterListRendererB);
    chapterListRenderer = chapterListRendererB;
  } else if (selectedLang === 'Python') {
    // setChapterListRenderer(chapterListRendererC);
    chapterListRenderer = chapterListRendererC;
  }
  // }, [selectedLang])

  return (
    <ChapterSelectComponent
      items={sourceLanguages}
      onItemSelect={handleChapterSelect}
      itemRenderer={chapterRenderer}
      itemListRenderer={chapterListRenderer}
      filterable={false}
      disabled={disabled}
    >
      <Button
        className={Classes.MINIMAL}
        text={styliseSublanguage(sourceChapter, sourceVariant)}
        rightIcon={disabled ? null : IconNames.DOUBLE_CARET_VERTICAL}
        disabled={disabled}
      />
    </ChapterSelectComponent>
  );
};
